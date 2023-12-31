import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  Pair,
  Price,
  Token,
  WNATIVE,
  WETH,
  ERC20Token,
} from '@pancakeswap/sdk'
import { FAST_INTERVAL } from 'config/constants'
import { BUSD, ONEPIECE, ONEPIECE_BASE, USDC, USDC_BASE, BUSD_BSC } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import useSWR from 'swr'
import getLpAddress from 'utils/getLpAddress'
import { multiplyPriceByAmount } from 'utils/prices'
import { isChainTestnet } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { formatUnits } from '@ethersproject/units'
import { nativeStableLpMap } from 'state/farms/getFarmsPrices'
import { usePairContract } from './useContract'
import { PairState, usePairs } from './usePairs'
import { useActiveChainId } from './useActiveChainId'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveChainId()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId]
  const stable = USDC[chainId] || BUSD[chainId]
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [stable && wrapped?.equals(stable) ? undefined : wrapped, stable],
      [chainId ? wnative : undefined, stable],
    ],
    [wnative, stable, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)
  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative) {
      return undefined
    }

    const isBUSDPairExist =
      busdPair &&
      busdPairState === PairState.EXISTS &&
      busdPair.reserve0.greaterThan('0') &&
      busdPair.reserve1.greaterThan('0')

    console.log("busdPair:", busdPair)
    // handle weth/base
    if (wrapped.equals(wnative)) {
      if (isBUSDPairExist) {
        if (busdPair.token0.name === "WETH") {
          const reserve0 = parseFloat(busdPair.reserve0.toExact())

          const reserve1 = parseFloat(busdPair.reserve1.toExact()) * 1e12

          const price = reserve0 / reserve1
          const newPrice = new Price(currency, stable, reserve1 * busdPair.token1.decimals, reserve0 * busdPair.token0.decimals)
          return newPrice
        }
        if (busdPair.token1.name === "WETH") {
          const reserve0 = parseFloat(busdPair.reserve0.toExact())

          const reserve1 = parseFloat(busdPair.reserve1.toExact()) * 1e12

          const price = reserve1 / reserve0
          const newPrice = new Price(currency, stable, reserve0 * busdPair.token0.decimals, reserve1 * busdPair.token1.decimals)
          return newPrice
          // const price = busdPair.priceOf(wnative)
          // const newPrice = new Price(currency, stable, price.denominator, price.numerator)
          // return newPrice
        }
        return undefined
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(stable)) {
      return new Price(stable, stable, '1', '1')
    }

    const isBnbPairExist =
      bnbPair &&
      bnbPairState === PairState.EXISTS &&
      bnbPair.reserve0.greaterThan('0') &&
      bnbPair.reserve1.greaterThan('0')
    const isBusdBnbPairExist =
      busdBnbPair &&
      busdBnbPairState === PairState.EXISTS &&
      busdBnbPair.reserve0.greaterThan('0') &&
      busdBnbPair.reserve1.greaterThan('0')

    const bnbPairBNBAmount = isBnbPairExist && bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue: JSBI =
      bnbPairBNBAmount && isBUSDPairExist && isBusdBnbPairExist
        ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient
        : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (isBUSDPairExist && busdPair.reserveOf(stable).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, stable, price.denominator, price.numerator)
    }
    if (isBnbPairExist && isBusdBnbPairExist) {
      if (busdBnbPair.reserveOf(stable).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(stable)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, stable, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    stable,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const pairAddress = getLpAddress(tokenA, tokenB)
  console.log("usePriceByPairs:", tokenA.address, tokenB.address)
  // if (tokenA.symbol === "WETH" && tokenB.symbol === "ONEPIECE" || tokenA.symbol === "ONEPIECE" && tokenB.symbol === "WETH") {
  //   pairAddress = "0x57798A9494AD216Da695C30F1D7120C4DE601F9a"
  // }

  const pairContract = usePairContract(pairAddress)
  const provider = useProvider({ chainId: currencyA.chainId })

  const wethUSDC = nativeStableLpMap[ChainId.BASE].address

  const wethUSDCContract = usePairContract(wethUSDC)

  const { data: price } = useSWR(
    currencyA && currencyB && ['pair-price', currencyA, currencyB],
    async () => {
      const reserves = await pairContract.connect(provider).getReserves()
      if (!reserves) {
        return null
      }
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
      )
      // if (pairAddress !== "0x57798A9494AD216Da695C30F1D7120C4DE601F9a") {
      //   return pair.priceOf(tokenB)
      // }
      const onePiecePriceOfWETH = pair.priceOf(tokenB)
      console.log("onePiecePriceOfWETH:", onePiecePriceOfWETH.toFixed(2))
      const reservesWETH = await wethUSDCContract.connect(provider).getReserves()
      if (!reservesWETH) {
        return null
      }
      const { reserve0: reserveWETH0, reserve1: reserveWETH1 } = reservesWETH

      const amount0 = parseFloat(formatUnits(reserveWETH0, 18))
      const amount1 = parseFloat(formatUnits(reserveWETH1, 6))
      const wethPrice = amount1 / amount0
      const fixedPrice = onePiecePriceOfWETH?.toFixed(2)

      const onePiecePriceUSD = wethPrice / parseFloat(fixedPrice)
      console.log("onePiecePriceNumber:", onePiecePriceUSD, "fixedPrice:", fixedPrice)
      return new Price(ONEPIECE_BASE, WETH[ChainId.BASE], amount0, amount1)
    },
    { dedupingInterval: FAST_INTERVAL, refreshInterval: FAST_INTERVAL },
  )

  return price
}

export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    const price = multiplyPriceByAmount(busdPrice, amount)
    console.log("multiplyPriceByAmount:", currency, amount)
    return price
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

// @Note: only fetch from one pair
export const useCakeBusdPrice = (
  { forceMainnet } = { forceMainnet: false },
): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  const isTestnet = !forceMainnet && isChainTestnet(chainId)
  // Return bsc testnet cake if chain is testnet
  const onePiece: Token = isTestnet ? ONEPIECE[ChainId.BSC_TESTNET] : ONEPIECE[ChainId.BASE]
  return usePriceByPairs(WETH[onePiece.chainId], onePiece)
}

// @Note: only fetch from one pair
export const useBNBBusdPrice = (
  { forceMainnet } = { forceMainnet: false },
): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  const isTestnet = !forceMainnet && isChainTestnet(chainId)
  // Return bsc testnet weth if chain is testnet
  const weth: Token = isTestnet ? WETH[ChainId.BSC_TESTNET] : WETH[ChainId.BASE]
  return usePriceByPairs(BUSD[weth.chainId], weth)
}
