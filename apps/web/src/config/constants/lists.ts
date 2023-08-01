const PANCAKE_EXTENDED = 'config/constants/tokenLists/base-default.tokenlist.json'
const COINGECKO = 'https://tokens.baseswap.finance/coingecko.json'
const CMC = 'https://tokens.baseswap.finance/cmc.json'

// List of official tokens list
export const OFFICIAL_LISTS = [PANCAKE_EXTENDED]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANCAKE_EXTENDED
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [PANCAKE_EXTENDED]
