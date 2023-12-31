import useSWR from 'swr'
import { ChainId } from '@pancakeswap/sdk'
import { fetchCProxyAddress } from 'state/farms/fetchFarmUser'
import { farmFetcher } from 'state/farms'

export const useFarmCProxyAddress = (account?: string, chainId?: number) => {
  const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BASE
  const { data } = useSWR(account && chainId && ['proxyAddress'], async () =>
    fetchCProxyAddress(account, multiCallChainId),
  )

  return {
    cProxyAddress: data,
  }
}
