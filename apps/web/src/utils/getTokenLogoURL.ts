import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token, WETH } from '@pancakeswap/sdk'
import { USDT_BASE } from '@pancakeswap/tokens'

const mapping = {
  [ChainId.BASE]: 'smartchain',
}

const getTokenLogoURL =
(token?: Token) => {
  console.log("getTokenLogoURL:",token)
    if (token && token.address === WETH[ChainId.BASE].address ) {
      return `/images/weth.png`
    }
    if (token && token.address === USDT_BASE.address ) {
      return `/images/usdt-assets/usdt.png`
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
