import { Token } from '@pancakeswap/sdk'
import { baseTokens } from '@pancakeswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

const { pokemoney, free, safemoon, gala } = bscWarningTokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  pokemoney,
  free,
  gala,
}

export default SwapWarningTokens
