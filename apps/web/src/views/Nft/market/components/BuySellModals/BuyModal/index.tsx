import { MaxUint256, Zero } from '@ethersproject/constants'
import { formatEther, parseUnits } from '@ethersproject/units'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { baseTokens } from '@pancakeswap/tokens'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance, { useGetBASEBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage, PaymentCurrency } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

// NFT WETH in testnet contract is different
const TESTNET_WBNB_NFT_ADDRESS = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

const BuyModal: React.FC<React.PropsWithChildren<BuyModalProps>> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BASE)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account, chainId } = useActiveWeb3React()
  const wbnbAddress = chainId === ChainId.BSC_TESTNET ? TESTNET_WBNB_NFT_ADDRESS : baseTokens.weth.address
  const wbnbContractReader = useERC20(wbnbAddress, false)
  const wbnbContractApprover = useERC20(wbnbAddress)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice, 'ether')
  const nftPrice = parseFloat(nftToBuy?.marketData?.currentAskPrice)

  // BASE - returns ethers.BigNumber
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useGetBASEBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  // WETH - returns BigNumber
  const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(wbnbAddress)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.BASE ? formattedBnbBalance : formattedWbnbBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.BASE ? bnbFetchStatus : wbnbFetchStatus

  const notEnoughBnbForPurchase =
    paymentCurrency === PaymentCurrency.BASE
      ? bnbBalance.lt(nftPriceWei)
      : wbnbBalance.lt(ethersToBigNumber(nftPriceWei))

  useEffect(() => {
    if (bnbBalance.lt(nftPriceWei) && wbnbBalance.gte(ethersToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WETH)
      setIsPaymentCurrentInitialized(true)
    }
  }, [bnbBalance, wbnbBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(wbnbContractReader, account, nftMarketContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(wbnbContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WETH!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice) ? Zero : parseUnits(nftToBuy?.marketData?.currentAskPrice)
      if (paymentCurrency === PaymentCurrency.BASE) {
        return callWithGasPrice(nftMarketContract, 'buyTokenUsingBNB', [nftToBuy.collectionAddress, nftToBuy.tokenId], {
          value: payAmount,
        })
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWBNB', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WETH && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughBnbForPurchase={notEnoughBnbForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
