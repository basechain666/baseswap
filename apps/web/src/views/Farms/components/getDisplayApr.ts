export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  let result :any
  console.log("cakeRewardsApr:", cakeRewardsApr, "lpRewardsApr:", lpRewardsApr)
  if (cakeRewardsApr && lpRewardsApr) {
    result = (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
    return result
  }
  if (cakeRewardsApr) {
    result = cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    return result
  }
  if (lpRewardsApr) {
    result = lpRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    return result
  }
  return null
}
