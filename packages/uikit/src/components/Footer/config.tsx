import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon, ZeroPlusIcon } from "../Svg";
// import { zeroplus } from "";
export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.OnePieceSwap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/OnePieceSwap",
      },
      {
        label: "Community",
        href: "https://docs.OnePieceSwap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.OnePieceSwap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://OnePieceSwap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.OnePieceSwap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.OnePieceSwap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.OnePieceSwap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/OnePieceSwap",
      },
      {
        label: "Documentation",
        href: "https://docs.OnePieceSwap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@OnePieceSwap-1/s/OnePieceSwap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.OnePieceSwap.finance/help/faq#is-OnePieceSwap-safe-has-OnePieceSwap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.OnePieceSwap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  // {
  //   label: "Twitter",
  //   icon: TwitterIcon,
  //   href: "https://twitter.com/OnePiece_Swap",
  // },

  // {
  //   label: "Telegram",
  //   icon: TelegramIcon,
  //   href: "https://t.me/RobotSwap00",
  // }



];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
