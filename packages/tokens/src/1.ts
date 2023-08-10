import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC, USDT, WBTC_ETH } from '@pancakeswap/tokens'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  onepiece: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
}
