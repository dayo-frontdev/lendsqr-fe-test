import usersIcon from "../../assets/user-friends.png";
import guarantorsIcon from "../../assets/users.png";
import loansIcon from "../../assets/sack.png";
import decisionModelsIcon from "../../assets/handshake-regular.png";
import savingsIcon from "../../assets/piggy-bank.png";
import loanRequestsIcon from "../../assets/Group-104.png";
import whitelistIcon from "../../assets/user-check.png";
import karmaIcon from "../../assets/user-times.png";
import organizationIcon from "../../assets/briefcase.png";
import loanProductsIcon from "../../assets/Group-104.png";
import savingsProductsIcon from "../../assets/np_bank.png";
import feesChargesIcon from "../../assets/coins-solid.png";
import transactionsIcon from "../../assets/transactionicon.png";
import servicesIcon from "../../assets/galaxy.png";
import serviceAccountIcon from "../../assets/user-cog.png";
import settlementsIcon from "../../assets/scroll.png";
import reportsIcon from "../../assets/chart-bar.png";
import preferencesIcon from "../../assets/sliders-h.png";
import feesPricingIcon from "../../assets/badge-percent.png";
import auditLogsIcon from "../../assets/clipboard-list.png";
import homeIcon from "../../assets/homeIcon.png";
import { nanoid } from "nanoid";

interface NavigationItem {
  nav: string;
  img: string;
  isRunning: boolean;
  id: string;
}

interface NavigationCategory {
  category: string;
  subItems: NavigationItem[];
}

const navigation: NavigationCategory[] = [
  {
    category: "",
    subItems: [
      { nav: "Dashboard", img: homeIcon, isRunning: true, id: nanoid() },
    ],
  },
  {
    category: "CUSTOMERS",
    subItems: [
      { nav: "Users", img: usersIcon, isRunning: false, id: nanoid() },
      {
        nav: "Guarantors",
        img: guarantorsIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Loans", img: loansIcon, isRunning: false, id: nanoid() },
      {
        nav: "Decision Models",
        img: decisionModelsIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Savings", img: savingsIcon, isRunning: false, id: nanoid() },
      {
        nav: "Loan Requests",
        img: loanRequestsIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Whitelist", img: whitelistIcon, isRunning: false, id: nanoid() },
      { nav: "Karma", img: karmaIcon, isRunning: false, id: nanoid() },
    ],
  },
  {
    category: "BUSINESSES",
    subItems: [
      {
        nav: "Organization",
        img: organizationIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Loan Products",
        img: loanProductsIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Savings Products",
        img: savingsProductsIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Fees and Charges",
        img: feesChargesIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Transactions",
        img: transactionsIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Services", img: servicesIcon, isRunning: false, id: nanoid() },
      {
        nav: "Service Account",
        img: serviceAccountIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Settlements",
        img: settlementsIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Reports", img: reportsIcon, isRunning: false, id: nanoid() },
    ],
  },
  {
    category: "SETTINGS",
    subItems: [
      {
        nav: "Preferences",
        img: preferencesIcon,
        isRunning: false,
        id: nanoid(),
      },
      {
        nav: "Fees and Pricing",
        img: feesPricingIcon,
        isRunning: false,
        id: nanoid(),
      },
      { nav: "Audit Logs", img: auditLogsIcon, isRunning: false, id: nanoid() },
    ],
  },
];

export default navigation;
