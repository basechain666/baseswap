import { ChainId, WETH, ERC20Token } from '@pancakeswap/sdk'
import { CAKE_MAINNET, USDT_BASE } from './common'

export const baseTokens = {
  weth: WETH[ChainId.BASE],
  // base here points to the weth contract. Wherever the currency BASE is required, conditional checks for the symbol 'BASE' can be used
  eth: new ERC20Token(
    ChainId.BASE,
    WETH[ChainId.BASE].address,
    18,
    'ETH',
    'ETH',
    'https://www.baseswap.com/',
  ),
  usdt: USDT_BASE,
  cake: CAKE_MAINNET
}
