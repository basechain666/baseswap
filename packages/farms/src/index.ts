import { formatEther } from '@ethersproject/units'
import { MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { farmV2FetchFarms, FetchFarmsParams, fetchMasterChefV2Data } from './fetchFarms'
import { useMasterchef } from 'hooks/useContract'
import contracts from 'config/constants/contracts'

const supportedChainId = [ChainId.GOERLI, ChainId.BASE, ChainId.BSC_TESTNET, ChainId.ETHEREUM]
export const bCakeSupportedChainId = [ChainId.BASE, ChainId.BSC_TESTNET]

export function createFarmFetcher(multicallv2: MultiCallV2) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { isTestnet, farms, chainId } = params
    const masterChefAddress = isTestnet ? contracts.masterChef[ChainId.BSC_TESTNET] :contracts.masterChef[ChainId.BASE]
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock } = await fetchMasterChefV2Data({
      isTestnet,
      multicallv2,
      masterChefAddress,
    })
    const regularCakePerBlock = formatEther(cakePerBlock)
    const filtered = farms.filter((f) => !f.pid || poolLength.gt(f.pid))
    const farmsWithPrice = await farmV2FetchFarms({
      multicallv2,
      masterChefAddress,
      isTestnet,
      chainId,
      farms: filtered,
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
    })
    console.log("farmsWithPrice:", farmsWithPrice)

    return {
      farmsWithPrice,
      poolLength: poolLength.toNumber(),
      regularCakePerBlock: +regularCakePerBlock,
    }
  }
  return {
    fetchFarms,
    isChainSupported: (chainId: number) => supportedChainId.includes(chainId),
    supportedChainId,
    isTestnet: (chainId: number) => ![ChainId.BASE, ChainId.ETHEREUM].includes(chainId),
  }
}

export * from './apr'
export * from './farmsPriceHelpers'
export * from './types'
