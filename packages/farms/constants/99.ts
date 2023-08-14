import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    vaultPid: 0,
    lpSymbol: 'WETH-USDT LP',
    lpAddress: '0xe3FD2aeE54e48d35D0d703D31881fEe0931Ff7e8',
    quoteToken: {
      chainId: 99,
      address: '0x933e49214b9f641C02A40B84D3081ADa919aaDa3',
      decimals: 18,
      symbol: 'WETH',
      name: 'WETH',
      projectLink: 'https://pancakeswap.finance/',
    },
    token: {
        chainId: 99,
        address: '0x38933Faf010a90eFde93B2022033d76aB8734DfE',
        decimals: 18,
        symbol: 'ONEPIECE',
        name: 'ONEPIECE',
        projectLink: 'https://pancakeswap.finance/',
      },
  },
]

export default farms
