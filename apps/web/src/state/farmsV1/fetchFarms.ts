import { SerializedFarmConfig } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { BIG_ZERO, BIG_TWO } from '@pancakeswap/utils/bigNumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const farmResult = await fetchPublicFarmsData(farmsToFetch)
  const masterChefResult = await fetchMasterChefData(farmsToFetch)

  return farmsToFetch.map((farm, index) => {
    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
      farmResult[index]

    const [info, totalAllocPoint] = masterChefResult[index]

    const lpTotalSupplyBN = new BigNumber(lpTotalSupply)

    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(lpTotalSupplyBN)

    const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(getFullDecimalMultiplier(tokenDecimals))
    const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(getFullDecimalMultiplier(quoteTokenDecimals))

    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

    const lpTotalInQuoteToken = quoteTokenAmountMc.times(BIG_TWO)

    const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal: tokenAmountTotal.toJSON(),
      lpTotalSupply: lpTotalSupplyBN.toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
    }
   
  })
  return []
}

export default fetchFarms
