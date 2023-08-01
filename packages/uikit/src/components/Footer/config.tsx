import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.BaseSwap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/BaseSwap",
      },
      {
        label: "Community",
        href: "https://docs.BaseSwap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.BaseSwap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://BaseSwap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.BaseSwap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.BaseSwap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.BaseSwap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/BaseSwap",
      },
      {
        label: "Documentation",
        href: "https://docs.BaseSwap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@BaseSwap-1/s/BaseSwap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.BaseSwap.finance/help/faq#is-BaseSwap-safe-has-BaseSwap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.BaseSwap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/BaseSwap",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/BaseSwap",
      },
      {
        label: "中文",
        href: "https://t.me/BaseSwap_CN",
      },
      {
        label: "繁體",
        href: "https://t.me/BaseSwap_TW",
      },
      {
        label: "日本語",
        href: "https://t.me/baseswapjp",
      },
      {
        label: "한국어",
        href: "https://t.me/baseswapko",
      },
    ],
  },
 
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
