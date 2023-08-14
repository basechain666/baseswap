import { SerializedFarmConfig } from '@pancakeswap/farms'
import { baseTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './common'

const farms: SerializedFarmConfig[] = [
    {
        pid: 0,
        vaultPid: 0,
        lpSymbol: 'WETH-ONEPIECE LP',
        lpAddress: '0x57798A9494AD216Da695C30F1D7120C4DE601F9a',
        quoteToken: {
          chainId: 8453,
          address: '0x4200000000000000000000000000000000000006',
          decimals: 18,
          symbol: 'WETH',
          name: 'WETH',
          projectLink: 'https://onepiece.finance/',
        },
        token: {
            chainId: 8453,
            address: '0xBA78d493f42e63ABd27853FA1e7FD5060A351fA3',
            decimals: 18,
            symbol: 'ONEPIECE',
            name: 'ONEPIECE',
            projectLink: 'https://onepiece.finance/',
          },
      },
]

export default farms
