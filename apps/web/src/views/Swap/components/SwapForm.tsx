import { useCallback, useEffect, useState, useMemo, useContext } from 'react'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Button, ArrowDownIcon, Box, Skeleton, Swap as SwapUI, Message, MessageText } from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import AccessRisk from 'views/Swap/components/AccessRisk'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import { AutoRow } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'

import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'

import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { currencyId } from 'utils/currencyId'

import CurrencyInputHeader from './CurrencyInputHeader'
import SwapCommitButton from './SwapCommitButton'
import useWarningImport from '../hooks/useWarningImport'
import useRefreshBlockNumberID from '../hooks/useRefreshBlockNumber'
import AddressInputPanel from './AddressInputPanel'
import AdvancedSwapDetailsDropdown from './AdvancedSwapDetailsDropdown'
import { ArrowWrapper, Wrapper } from './styleds'
import { useStableFarms } from '../StableSwap/hooks/useStableConfig'
import { isAddress } from '../../../utils'
import { SwapFeaturesContext } from '../SwapFeaturesContext'

export default function SwapForm() {
  const { isAccessTokenSupported } = useContext(SwapFeaturesContext)
  const { t } = useTranslation()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const stableFarms = useStableFarms()
  const warningSwapHandler = useWarningImport()

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const hasStableSwapAlternative = useMemo(() => {
    return stableFarms.some((stableFarm) => {
      const checkSummedToken0 = isAddress(stableFarm?.token0.address)
      const checkSummedToken1 = isAddress(stableFarm?.token1.address)
      return (
        (checkSummedToken0 === inputCurrencyId || checkSummedToken0 === outputCurrencyId) &&
        (checkSummedToken1 === outputCurrencyId || checkSummedToken1 === outputCurrencyId)
      )
    })
  }, [stableFarms, inputCurrencyId, outputCurrencyId])

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (newCurrencyOutput) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  return (
    <div >
      <CurrencyInputHeader
        title={t('Swap')}
        subtitle={t('Trade tokens in an instant')}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanel
            showBUSD
            label={independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={!atMaxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          <AutoColumn justify="space-between">
            <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
              <SwapUI.SwitchButton
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                  replaceBrowserHistory('inputCurrency', outputCurrencyId)
                  replaceBrowserHistory('outputCurrency', inputCurrencyId)
                }}
              />
              {recipient === null && !showWrap && isExpertMode ? (
                <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                  {t('+ Add a send (optional)')}
                </Button>
              ) : null}
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanel
            showBUSD
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          {isAccessTokenSupported && (
            <Box>
              <AccessRisk inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
            </Box>
          )}

          {isExpertMode && recipient !== null && !showWrap ? (
            <>
              <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable={false}>
                  <ArrowDownIcon width="16px" />
                </ArrowWrapper>
                <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                  {t('- Remove send')}
                </Button>
              </AutoRow>
              <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
            </>
          ) : null}

          {showWrap ? null : (
            <SwapUI.Info
              price={
                Boolean(trade) && (
                  <>
                    <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
                    {isLoading ? (
                      <Skeleton width="100%" ml="8px" height="24px" />
                    ) : (
                      <SwapUI.TradePrice price={trade?.executionPrice} />
                    )}
                  </>
                )
              }
              allowedSlippage={allowedSlippage}
            />
          )}
        </AutoColumn>
        {hasStableSwapAlternative && (
          <AutoColumn>
            <Message variant="warning" my="16px">
              <MessageText>{t('Trade stablecoins in StableSwap with lower slippage and trading fees!')}</MessageText>
            </Message>
          </AutoColumn>
        )}
        <Box mt="0.25rem">
          <SwapCommitButton
            swapIsUnsupported={swapIsUnsupported}
            account={account}
            showWrap={showWrap}
            wrapInputError={wrapInputError}
            onWrap={onWrap}
            wrapType={wrapType}
            parsedIndepentFieldAmount={parsedAmounts[independentField]}
            approval={approval}
            approveCallback={approveCallback}
            approvalSubmitted={approvalSubmitted}
            currencies={currencies}
            isExpertMode={isExpertMode}
            trade={trade}
            swapInputError={swapInputError}
            currencyBalances={currencyBalances}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onUserInput={onUserInput}
          />
        </Box>
      </Wrapper>
      {!swapIsUnsupported ? (
        trade && <AdvancedSwapDetailsDropdown trade={trade} />
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </div>
  )
}
