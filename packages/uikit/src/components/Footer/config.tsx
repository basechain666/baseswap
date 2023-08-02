import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.BaseDex.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/BaseDex",
      },
      {
        label: "Community",
        href: "https://docs.BaseDex.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.BaseDex.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://BaseDex.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.BaseDex.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.BaseDex.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.BaseDex.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/BaseDex",
      },
      {
        label: "Documentation",
        href: "https://docs.BaseDex.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@BaseDex-1/s/BaseDex/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.BaseDex.finance/help/faq#is-BaseDex-safe-has-BaseDex-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.BaseDex.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/BaseDex",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/BaseDex",
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
