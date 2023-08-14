import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

const baseExplorer = { name: 'BaseScan', url: 'https://basescan.org/' }

export const base: Chain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  rpcUrls: {
    public: 'https://smart-intensive-tent.base-mainnet.quiknode.pro/95312447a671f04380b63478cc4d267e7265b4ef/',
    default: 'https://smart-intensive-tent.base-mainnet.quiknode.pro/95312447a671f04380b63478cc4d267e7265b4ef/',
    // public: 'https://rpc.porkersfarm.online',
    // default: 'https://rpc.porkersfarm.online',
    // public: 'http://144.202.109.99:8547',
    // default: 'http://144.202.109.99:8547',
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
    address: '0xf5560E11657e69eEc78eAe000fD8C58421898cD5',
    blockCreated: 2098185,
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
