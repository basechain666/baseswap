import { LinkExternal } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

const config = (t: ContextApi['t']) => {
  return [
    {
      title: t('I sold an NFT, where’s my BASE?'),
      description: [
        t(
          'Trades are settled in WETH, which is a wrapped version of BASE used on BASE Chain. That means that when you sell an item, WETH is sent to your wallet instead of BASE.',
        ),
        t('You can instantly swap your WETH for BASE with no trading fees on OnePieceSwap.'),
      ],
    },
    {
      title: t('How can I list my NFT collection on the Market?'),
      description: [
        t('In Phase 2 of the NFT Marketplace, collections must be whitelisted before they may be listed.'),
        t('We are now accepting applications from NFT collection owners seeking to list their collections.'),
        <LinkExternal href="https://docs.OnePieceSwap.finance/contact-us/nft-market-applications">
          {t('Please apply here')}
        </LinkExternal>,
      ],
    },
    {
      title: t('What are the fees?'),
      description: [
        t(
          '100% of all platform fees taken by OnePieceSwap from sales are used to buy back and BURN ONEPIECE tokens in our weekly ONEPIECE burns.',
        ),
        t(
          'Platform fees: 2% is subtracted from NFT sales on the market. Subject to change.Collection fees: Additional fees may be taken by collection creators, once those collections are live. These will not contribute to the ONEPIECE burns.',
        ),
      ],
    },
  ]
}

export default config
