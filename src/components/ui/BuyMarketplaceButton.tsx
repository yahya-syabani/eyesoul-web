"use client";

import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface MarketplaceLink {
  platform: "tokopedia" | "shopee" | "ruparupa";
  url: string;
  inStock: boolean;
}

interface BuyMarketplaceButtonProps {
  links?: MarketplaceLink[];
  className?: string;
}

export function BuyMarketplaceButton({ links, className = "" }: BuyMarketplaceButtonProps) {
  const t = useTranslations("Common");

  if (!links || links.length === 0) {
    return null;
  }

  // Filter out out-of-stock links if necessary, though usually we disable them
  const availableLinks = links.filter((link) => link.inStock);

  if (availableLinks.length === 0) {
    return (
      <button disabled className={buttonVariants({ variant: "default", className: `w-full opacity-50 cursor-not-allowed ${className}` })}>
        Out of Stock
      </button>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {availableLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "default", className: "w-full uppercase font-medium tracking-wide" })}
        >
          {t("buyNow")} {link.platform === "tokopedia" ? "Tokopedia" : link.platform === "shopee" ? "Shopee" : "Ruparupa"}
        </a>
      ))}
    </div>
  );
}
