import { infoClient, infoClientETH, infoStableSwapClient } from 'utils/graphql'
import { INFO_CLIENT, INFO_CLIENT_ETH, BLOCKS_CLIENT, BLOCKS_CLIENT_ETH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_V2_START, PCS_ETH_START, ETH_TOKEN_BLACKLIST, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'BASE' | 'ETH'

export const multiChainQueryMainToken = {
  BASE: 'BASE',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  BASE: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
}

export const multiChainStartTime = {
  BASE: PCS_V2_START,
  ETH: PCS_ETH_START,
}

export const multiChainId = {
  BASE: ChainId.BASE,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.BASE]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  BASE: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  BASE: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  BASE: 'BscScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  BASE: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
