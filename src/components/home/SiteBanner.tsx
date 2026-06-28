"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SiteBannerProps {
  message?: string;
  link?: string;
  linkLabel?: string;
}

export function SiteBanner({ message, link, linkLabel }: SiteBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!message || dismissed) return null;

  return (
    <div className="bg-primary text-primary-foreground text-sm text-center py-2.5 px-4 relative">
      <span>{message}</span>
      {link && linkLabel && (
        <a
          href={link}
          className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
        >
          {linkLabel}
        </a>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
