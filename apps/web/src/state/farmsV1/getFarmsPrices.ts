import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { filterFarmsByQuoteToken, SerializedFarm } from '@pancakeswap/farms'
import { baseTokens } from '@pancakeswap/tokens'

const getFarmFromTokenSymbol = (
  farms: SerializedFarm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  BASEPriceUsdt: BigNumber,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === baseTokens.usdt.symbol) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === baseTokens.weth.symbol) {
    return hasTokenPriceVsQuote ? BASEPriceUsdt.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BASE farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WETH, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BASE, (pBTC - BASE)
  // from the BASE - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === baseTokens.weth.symbol) {
    const quoteTokenInBusd = BASEPriceUsdt.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === baseTokens.usdt.symbol) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/WETH quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  BASEPriceUsdt: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'WETH') {
    return BASEPriceUsdt
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WETH') {
    return quoteTokenFarm.tokenPriceVsQuote ? BASEPriceUsdt.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const getFarmsPrices = (farms: SerializedFarm[]) => {
  const bnbBusdFarm = farms.find((farm) => farm.v1pid === 252)
  const BASEPriceUsdt = bnbBusdFarm.tokenPriceVsQuote ? BIG_ONE.div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, quoteTokenFarm, BASEPriceUsdt)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, BASEPriceUsdt)

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices
