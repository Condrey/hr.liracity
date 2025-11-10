import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const webName = "Human resource";
export const organization = "Lira City";
export const siteConfig = {
  name: `Human Resource – Lira City Council`,
  url: process.env.NEXT_PUBLIC_BASE_URL,
  logo: "/logo.png",
  defaultCoverImage: "/web-app-manifest-512x512.png",
  description: `All-in-one spot for managing Human Resource related activities at Lira City Council.`,
};

export function formatCurrency(amount: number | null) {
  let formattedAmount: number;
  if (!amount) {
    formattedAmount = 0;
  } else {
    formattedAmount = amount;
  }
  return formattedAmount.toLocaleString("en-US", {
    currency: "UGX",
    style: "currency",
  });
}

export function getTitle(position: string | undefined): string {
  return (position || "")
    .split(" ")
    .map((word) => {
      if (word.toLowerCase() === "and") {
        return "";
      }
      return word.charAt(0).toUpperCase();
    })
    .join("");
}
