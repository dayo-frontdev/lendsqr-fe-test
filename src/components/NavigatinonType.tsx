import type { JSX } from "react/jsx-dev-runtime";

export interface NavigationItem {
  nav: string;
  img: string;
  isRunning: boolean;
  id: string;
}

export interface NavigationCategory {
  category: string;
  subItems: NavigationItem[];
}

export type SideBarTaskType = {
  currentTask: NavigationCategory[];
  setTask: React.Dispatch<React.SetStateAction<NavigationCategory[]>>;
  Mobilehamburger: JSX.Element;
  isMobile: boolean;
};

export type DashboardType = {
  currentTask: NavigationCategory[];
  setTask: React.Dispatch<React.SetStateAction<NavigationCategory[]>>;
};
