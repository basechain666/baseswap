import { ChainId } from '@pancakeswap/sdk'

export const verifyBscNetwork = (chainId: number) => {
  return chainId === ChainId.BASE || chainId === ChainId.BSC_TESTNET
}
