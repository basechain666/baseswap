import { ChainId } from '@pancakeswap/sdk'

export const verifyBaseNetwork = (chainId: number) => {
  return chainId === ChainId.BASE
}
