import { HomeIcon, LucideIcon, Users2Icon } from "lucide-react";

export const MAX_ATTACHMENTS = 5;
export const REDIRECT_TO_URL_SEARCH_PARAMS = "redirectToUrl";

export type NavLink = { title: string; href: string; description: string };
export type NavLinkGroup = {
  title: string;
  href: string;
  showOnMediumScreen: boolean;
  description: string;
  children: NavLink[];
  icon?: LucideIcon;
};
export const staffListLinks: NavLink[] = [
  {
    title: "List all",
    href: "/staff-lists",
    description: "View all staffs of Lira City council",
  },
  {
    title: "Departments",
    href: "/departments",
    description: "View staffs per department of Lira City council",
  },
];
export const navLinks: NavLinkGroup[] = [
  {
    title: "Home",
    href: "/",
    description: "",
    icon: HomeIcon,
    children: [],
    showOnMediumScreen: true,
  },
  {
    title: "Staff List",
    href: "/staff-lists",
    description: "View all staffs of Lira City council",
    icon: Users2Icon,
    children: staffListLinks,
    showOnMediumScreen: true,
  },
];
