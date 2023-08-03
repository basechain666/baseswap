/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { parse } from 'querystring'
import { renderHook } from '@testing-library/react-hooks'
import { DEFAULT_OUTPUT_CURRENCY } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { createReduxWrapper } from 'testUtils'
import { Field } from './actions'
import { queryParametersToSwapState, useDerivedSwapInfo, useSwapState } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('TOMO to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            'inputCurrency=TOMO&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT',
          ),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        [Field.INPUT]: { currencyId: 'TOMO' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('should return TOMO CAKE pair by default', () => {
      expect(queryParametersToSwapState(parse(''))).toEqual({
        [Field.OUTPUT]: { currencyId: DEFAULT_OUTPUT_CURRENCY },
        [Field.INPUT]: { currencyId: 'TOMO' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('does not duplicate TOMO for invalid output token', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=invalid'), 'TOMO')).toEqual({
        [Field.INPUT]: { currencyId: '' },
        [Field.OUTPUT]: { currencyId: 'TOMO' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('output TOMO only', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=bnb&exactAmount=20.5'), 'TOMO')).toEqual({
        [Field.OUTPUT]: { currencyId: 'TOMO' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=TOMO&exactAmount=20.5&recipient=abc'), 'TOMO')).toEqual({
        [Field.OUTPUT]: { currencyId: 'TOMO' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('outputCurrency=TOMO&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5'),
          'TOMO',
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'TOMO' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
  })
})

// weird bug on jest Reference Error, must use `var` here
var mockUseActiveWeb3React: jest.Mock

jest.mock('../../hooks/useActiveWeb3React', () => {
  mockUseActiveWeb3React = jest.fn().mockReturnValue({
    chainId: 56,
  })
  return {
    __esModule: true,
    default: mockUseActiveWeb3React,
  }
})

var mockAccount: jest.Mock

jest.mock('wagmi', () => {
  mockAccount = jest.fn().mockReturnValue({})
  const original = jest.requireActual('wagmi') // Step 2.
  return {
    ...original,
    useAccount: mockAccount,
  }
})

describe('#useDerivedSwapInfo', () => {
  it('should show Login Error', async () => {
    const { result, rerender } = renderHook(
      () => {
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        return useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
      },
      { wrapper: createReduxWrapper() },
    )
    expect(result.current.inputError).toBe('Connect Wallet')

    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    rerender()

    expect(result.current.inputError).toBe('Enter an amount')
    mockAccount.mockClear()
  })

  it('should show [Enter a recipient] Error', async () => {
    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    const { result, rerender } = renderHook(
      () => {
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        return useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
      },
      {
        wrapper: createReduxWrapper({
          swap: {
            typedValue: '0.11',
            [Field.INPUT]: { currencyId: 'TOMO' },
            [Field.OUTPUT]: { currencyId: 'TOMO' },
          },
        }),
      },
    )

    rerender()

    expect(result.current.inputError).toBe('Enter a recipient')
    mockAccount.mockClear()
  })

  it('should return undefined when no pair', async () => {
    const { result } = renderHook(
      () => {
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        const swapInfo = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
        return {
          swapInfo,
        }
      },
      {
        wrapper: createReduxWrapper(),
      },
    )

    expect(result.current.swapInfo.currencies.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencies.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.v2Trade).toBeUndefined()
    expect(result.current.swapInfo.parsedAmount).toBeUndefined()
  })
})
