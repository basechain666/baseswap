import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token, WETH } from '@pancakeswap/sdk'
import { ONEPIECE_BASE } from '@pancakeswap/tokens'

const mapping = {
  [ChainId.BASE]: 'smartchain',
}

const getTokenLogoURL =
(token?: Token) => {
    if (token && token.address === WETH[ChainId.BASE].address ) {
      return `/images/weth.png`
    }
    if (token && token.address === ONEPIECE_BASE.address ) {
      return `/images/onepiece-assets/onepiece.png`
    } 

    return null
  }


// const getTokenLogoURL = memoize(
//   (token?: Token) => {
//     // if (token && mapping[token.chainId]) {
//     //   return `https://assets-cdn.trustwallet.com/blockchains/${mapping[token.chainId]}/assets/${getAddress(
//     //     token.address,
//     //   )}/logo.png`
//     // }
//     return null
//   },
//   (t) => `${t.chainId}#${t.address}`,
// )

export default getTokenLogoURL
