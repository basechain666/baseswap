import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { usePotteryStatus } from './usePotteryStatus'
// import { useCompetitionStatus } from './useCompetitionStatus'
import { useVotingStatus } from './useVotingStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  // const currentBlock = useChainCurrentBlock(ChainId.BASE)
  // const activeIfo = useActiveIfoWithBlocks()
  // const competitionStatus = useCompetitionStatus()
  // const potteryStatus = usePotteryStatus()
  // const votingStatus = useVotingStatus()

  // const ifoStatus =
  //   currentBlock && activeIfo && activeIfo.endBlock > currentBlock
  //     ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
  //     : null

  return useMemo(() => {
    return {
      '/earn': 'soon',
      '/gamefi': 'soon' ,
      '/socialfi': 'soon' ,
    }
  }, [])
  // return {}
}
