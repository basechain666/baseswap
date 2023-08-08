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
        href: "https://docs.RobotSwap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/RobotSwap",
      },
      {
        label: "Community",
        href: "https://docs.RobotSwap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.RobotSwap.finance/tokenomics/cake",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://RobotSwap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.RobotSwap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.RobotSwap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.RobotSwap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/RobotSwap",
      },
      {
        label: "Documentation",
        href: "https://docs.RobotSwap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@RobotSwap-1/s/RobotSwap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.RobotSwap.finance/help/faq#is-RobotSwap-safe-has-RobotSwap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.RobotSwap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/RobotSwap",
  },

  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/RobotSwap00",
  }



];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
