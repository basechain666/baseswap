import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

// export const avalandche: Chain = {
//   id: 43114,
//   name: 'Avalanche C-Chain',
//   network: 'avalanche',
//   rpcUrls: {
//     default: 'https://rpc.ankr.com/avalanche',
//   },
//   nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
//   blockExplorers: {
//     default: {
//       name: 'snowtrace',
//       url: 'https://snowtrace.io/',
//     },
//   },
// }

// export const avalandcheFuji: Chain = {
//   id: 43113,
//   name: 'Avalanche Fuji',
//   network: 'avalanche-fuji',
//   rpcUrls: {
//     default: 'https://rpc.ankr.com/avalanche_fuji',
//   },
//   nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
//   blockExplorers: {
//     default: {
//       name: 'snowtrace',
//       url: 'https://testnet.snowtrace.io/',
//     },
//   },
//   testnet: true,
// }

// export const fanBASEpera: Chain = {
//   id: 250,
//   name: 'Fantom Opera',
//   network: 'fantom',
//   nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
//   rpcUrls: {
//     default: 'https://rpc.ftm.tools',
//   },
//   blockExplorers: {
//     default: {
//       name: 'FTMScan',
//       url: 'https://ftmscan.com',
//     },
//   },
// }

// export const fantomTestnet: Chain = {
//   id: 4002,
//   name: 'Fantom Testnet',
//   network: 'fantom-testnet',
//   nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
//   rpcUrls: {
//     default: 'https://rpc.testnet.fantom.network',
//   },
//   blockExplorers: {
//     default: {
//       name: 'FTMScan',
//       url: 'https://testnet.ftmscan.com',
//     },
//   },
//   testnet: true,
// }

// const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }
const baseExplorer = { name: 'BaseScan', url: 'https://scan.baseWeb3.io/#' }

export const base: Chain = {
  id: 8453,
  name: 'BaseWeb3 Chain',
  network: 'base',
  rpcUrls: {
    public: 'https://smart-intensive-tent.base-mainnet.quiknode.pro/95312447a671f04380b63478cc4d267e7265b4ef/',
    default: 'https://smart-intensive-tent.base-mainnet.quiknode.pro/95312447a671f04380b63478cc4d267e7265b4ef/',
  },
  blockExplorers: {
    default: baseExplorer,
    etherscan: baseExplorer,
  },
  nativeCurrency: {
    name: 'Base Chain Native Token',
    symbol: 'ETH',
    decimals: 18,
  },
  multicall: {
    address: '0x5c957f9744d002c4Ed41Bda8FeC7893E9D5341d4',
    blockCreated: 2015168,
  },
}

// export const bscTest: Chain = {
//   id: 97,
//   name: 'BASE Chain Testnet',
//   network: 'bsc-testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Binance Chain Native Token',
//     symbol: 'tBNB',
//   },
//   rpcUrls: {
//     public: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
//     default: 'https://data-seed-prebsc-1-s2.binance.org:8545/',
//   },
//   blockExplorers: {
//     default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
//   },
//   multicall: {
//     address: '0xcA11bde05977b3631167028862bE2a173976CA11',
//     blockCreated: 17422483,
//   },
//   testnet: true,
// }

// export { rinkeby, mainnet, goerli }
