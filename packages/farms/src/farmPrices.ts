import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import _toNumber from 'lodash/toNumber'
import { SerializedFarmPublicData, FarmData, isStableFarm } from './types'
import { FIXED_ONE, FIXED_TEN_IN_POWER_18, FIXED_TWO, FIXED_ZERO } from './const'

// Find BUSD price for token
// either via direct calculation if farm is X-BASE or X-BUSD
// or via quoteTokenFarm which is quoteToken-BASE or quoteToken-BUSD farm
export const getFarmBaseTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: FixedNumber,
  wNative: string,
  stable: string,
  quoteTokenInBusd,
): FixedNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)
  console.log("getFarmBaseTokenPrice:", stable, farm.quoteToken.symbol)
  if (farm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote ? FixedNumber.from(farm.tokenPriceVsQuote) : FIXED_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return hasTokenPriceVsQuote ? nativePriceUSD.mulUnsafe(FixedNumber.from(farm.tokenPriceVsQuote)) : FIXED_ONE
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BASE farms
  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WETH, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BASE, (pBTC - BASE)
  // from the BASE - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === wNative || quoteTokenFarm.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? FixedNumber.from(farm.tokenPriceVsQuote).mulUnsafe(quoteTokenInBusd)
      : FIXED_ONE
  }

  // Catch in case token does not have immediate or once-removed BUSD/WETH quoteToken
  return FIXED_ZERO
}

export const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: FixedNumber,
  wNative: string,
  stable: string,
): FixedNumber => {
  if (farm.quoteToken.symbol === stable) {
    return FIXED_ONE
  }

  if (farm.quoteToken.symbol === wNative) {
    return nativePriceUSD
  }

  if (!quoteTokenFarm) {
    return FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    return quoteTokenFarm.tokenPriceVsQuote
      ? nativePriceUSD.mulUnsafe(FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote))
      : FIXED_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote ? FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote) : FIXED_ZERO
  }

  return FIXED_ZERO
}

const getFarmFromTokenAddress = (
  farms: SerializedFarmPublicData[],
  tokenAddress: string,
  preferredQuoteTokens?: string[],
): SerializedFarmPublicData => {
  const farmsWithTokenSymbol = farms.filter((farm) => equalsIgnoreCase(farm.token.address, tokenAddress))
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const filterFarmsByQuoteToken = (
  farms: SerializedFarmPublicData[],
  preferredQuoteTokens: string[] = ['BUSD', 'WETH'],
): SerializedFarmPublicData => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export const getStableLpTokenPrice = (
  lpTotalSupply: FixedNumber,
  tokenAmountTotal: FixedNumber,
  tokenPriceBusd: FixedNumber,
  quoteTokenAmountTotal: FixedNumber,
  quoteTokenInBusd: FixedNumber,
) => {
  if (lpTotalSupply.isZero()) {
    return FIXED_ZERO
  }
  const valueOfBaseTokenInFarm = tokenPriceBusd.mulUnsafe(tokenAmountTotal)
  const valueOfQuoteTokenInFarm = quoteTokenInBusd.mulUnsafe(quoteTokenAmountTotal)

  const liquidity = valueOfBaseTokenInFarm.addUnsafe(valueOfQuoteTokenInFarm)

  const totalLpTokens = lpTotalSupply.divUnsafe(FIXED_TEN_IN_POWER_18)

  return liquidity.divUnsafe(totalLpTokens)
}

export const getLpTokenPrice = (
  lpTotalSupply: FixedNumber,
  lpTotalInQuoteToken: FixedNumber,
  tokenAmountTotal: FixedNumber,
  tokenPriceBusd: FixedNumber,
) => {
  // LP token price
  let lpTokenPrice = FIXED_ZERO
  const lpTotalSupplyAsBigNumber = BigNumber.from(lpTotalSupply)
  const lpTotalInQuoteTokenBigNumber = BigNumber.from(lpTotalInQuoteToken)
  if (lpTotalSupplyAsBigNumber.gt(0) && lpTotalInQuoteTokenBigNumber.gt(0)) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = tokenPriceBusd.mulUnsafe(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.mulUnsafe(FIXED_TWO)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = lpTotalSupply.divUnsafe(FIXED_TEN_IN_POWER_18)
    lpTokenPrice = overallValueOfAllTokensInFarm.divUnsafe(totalLpTokens)
  }

  return lpTokenPrice
}

export type FarmWithPrices = FarmData & {
  tokenPriceBusd: string
  quoteTokenPriceBusd: string
  lpTokenPrice: string
}

export const getFarmsPrices = (
  farms: FarmData[],
  nativeStableLp: {
    address: string
    wNative: string
    stable: string
  },
): FarmWithPrices[] => {
  
  const nativeStableFarm = farms.find((farm) => equalsIgnoreCase(farm.lpAddress, nativeStableLp.address))
  console.log("farms/src/getFarmsPrices:",nativeStableFarm)

  const nativePriceUSD =
    farms[0] && _toNumber(farms[0]?.tokenPriceVsQuote) !== 0
      ? FIXED_ONE.divUnsafe(FixedNumber.from(farms[0].tokenPriceVsQuote))
      : FIXED_ZERO

  console.log("farms/src/nativePriceUSD:",nativePriceUSD.toString())

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenAddress(farms, farm.quoteToken.address, [
      nativeStableLp.wNative,
      nativeStableLp.stable,
    ])

    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLp.wNative,
      nativeStableLp.stable,
    )

    const tokenPriceBusd = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      nativePriceUSD,
      nativeStableLp.wNative,
      nativeStableLp.stable,
      quoteTokenPriceBusd,
    )
    const lpTokenPrice = isStableFarm(farm)
      ? getStableLpTokenPrice(
          FixedNumber.from(farm.lpTotalSupply),
          FixedNumber.from(farm.tokenAmountTotal),
          tokenPriceBusd,
          FixedNumber.from(farm.quoteTokenAmountTotal),
          // Assume token is busd, tokenPriceBusd is tokenPriceVsQuote
          FixedNumber.from(farm.tokenPriceVsQuote),
        )
      : getLpTokenPrice(
          FixedNumber.from(farm.lpTotalSupply),
          FixedNumber.from(farm.lpTotalInQuoteToken),
          FixedNumber.from(farm.tokenAmountTotal),
          tokenPriceBusd,
        )
    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toString(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
      lpTokenPrice: lpTokenPrice.toString(),
    }
  })
  console.log("farms/src/farmsWithPrices:",farmsWithPrices)

  return farmsWithPrices
}
