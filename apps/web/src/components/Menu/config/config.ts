import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
  ShareIcon,
  DropdownMenuItems,
  TuneIcon,
  UnlockIcon
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Swap'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Liquidity'),
      icon: TuneIcon,
      // supportChainIds: [],
      fillIcon: TuneIcon,
      href: '/liquidity',
      showItemsOnMobile: false,
      // image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Farm'),
      href: '/farms',
      icon: ShareIcon,
      // supportChainIds: [],
      fillIcon: ShareIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },

    {
      label: t('Twitter'),
      href: '/twitter',
      target: "_blank",
      icon: EarnIcon,
      // supportChainIds: [],
      fillIcon: EarnFillIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
   
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
