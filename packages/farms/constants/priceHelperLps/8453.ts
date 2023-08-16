import { SerializedFarmConfig } from '@pancakeswap/farms'
import { ChainId, WETH } from '@pancakeswap/sdk'
import { ONEPIECE, ONEPIECE_BASE } from '@pancakeswap/tokens'

const priceHelperLps: SerializedFarmConfig[] = [
    {
        pid: 0,
        lpSymbol: 'WETH-ONEPIECE LP',
        lpAddress: '0x57798A9494AD216Da695C30F1D7120C4DE601F9a',
        quoteToken: WETH[ChainId.BASE],
        token: ONEPIECE_BASE,
    },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default priceHelperLps
