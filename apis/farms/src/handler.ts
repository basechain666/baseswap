import { FixedNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { getFarmCakeRewardApr, SerializedFarmConfig } from '@pancakeswap/farms'
import { ChainId, CurrencyAmount, Pair } from '@pancakeswap/sdk'
import { BUSD, ONEPIECE } from '@pancakeswap/tokens'
import { farmFetcher } from './helper'
import { FarmKV, FarmResult } from './kv'
import { updateLPsAPR } from './lpApr'
import { bscProvider, bscTestnetProvider } from './provider'

const pairAbi = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: 'blockTimestampLast',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const cakeBusdPairMap = {
  [ChainId.BASE]: {
    address: Pair.getAddress(ONEPIECE[ChainId.BASE], BUSD[ChainId.BASE]),
    tokenA: ONEPIECE[ChainId.BASE],
    tokenB: BUSD[ChainId.BASE],
  },
  [ChainId.BSC_TESTNET]: {
    address: Pair.getAddress(ONEPIECE[ChainId.BSC_TESTNET], BUSD[ChainId.BSC_TESTNET]),
    tokenA: ONEPIECE[ChainId.BSC_TESTNET],
    tokenB: BUSD[ChainId.BSC_TESTNET],
  },
}

const getCakePrice = async (isTestnet: boolean) => {
  const pairConfig = cakeBusdPairMap[isTestnet ? ChainId.BSC_TESTNET : ChainId.BASE]
  const pairContract = new Contract(pairConfig.address, pairAbi, isTestnet ? bscTestnetProvider : bscProvider)
  const reserves = await pairContract.getReserves()
  const { reserve0, reserve1 } = reserves
  const { tokenA, tokenB } = pairConfig

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
  )

  return pair.priceOf(tokenA)
}

export async function saveFarms(chainId: number, event: ScheduledEvent | FetchEvent) {
  try {
    const isTestnet = farmFetcher.isTestnet(chainId)
    const farmsConfig =  (await import(`/${chainId}.ts`)).default as SerializedFarmConfig[]
    console.log("saveFarms farmsConfig:", farmsConfig)
    let lpPriceHelpers: SerializedFarmConfig[] = []
    try {
      lpPriceHelpers = (await import(`/${chainId}.ts`)).default as SerializedFarmConfig[]
    } catch (error) {
      console.error('Get LP price helpers error', error)
    }

    if (!farmsConfig) {
      throw new Error(`Farms config not found ${chainId}`)
    }
    const { farmsWithPrice, poolLength, regularCakePerBlock } = await farmFetcher.fetchFarms({
      chainId,
      isTestnet,
      farms: farmsConfig.concat(lpPriceHelpers),
    })

    const cakeBusdPrice = await getCakePrice(isTestnet)
    const lpAprs = await handleLpAprs(chainId, farmsConfig)

    const finalFarm = farmsWithPrice.map((f) => {
      return {
        ...f,
        lpApr: lpAprs?.[f.lpAddress.toLowerCase()] || 0,
        cakeApr: getFarmCakeRewardApr(f, FixedNumber.from(cakeBusdPrice.toSignificant(3)), regularCakePerBlock),
      }
    }) as FarmResult

    const savedFarms = {
      updatedAt: new Date().toISOString(),
      poolLength,
      regularCakePerBlock,
      data: finalFarm,
    }

    event.waitUntil(FarmKV.saveFarms(chainId, savedFarms))

    return savedFarms
  } catch (error) {
    console.error('[ERROR] fetching farms', error)
    throw error
  }
}

export async function handleLpAprs(chainId: number, farmsConfig?: SerializedFarmConfig[]) {
  let lpAprs = await FarmKV.getApr(chainId)
  if (!lpAprs) {
    lpAprs = await saveLPsAPR(chainId, farmsConfig)
  }
  return lpAprs || {}
}

export async function saveLPsAPR(chainId: number, farmsConfig?: SerializedFarmConfig[]) {
  // TODO: add other chains
  if (chainId === 99) {
    let data = farmsConfig
    if (!data) {
      const value = await FarmKV.getFarms(chainId)
      if (value && value.data) {
        // eslint-disable-next-line prefer-destructuring
        data = value.data
      }
    }
    if (data) {
      const aprMap = (await updateLPsAPR(chainId, data)) || null
      FarmKV.saveApr(chainId, aprMap)
      return aprMap || null
    }
    return null
  }
  return null
}
