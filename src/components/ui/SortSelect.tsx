"use client";

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortSelectProps {
  defaultValue: string;
}

export function SortSelect({ defaultValue }: SortSelectProps) {
  const t = useTranslations('catalogue');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <select
      value={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-transparent outline-none focus:border-foreground"
    >
      <option value="newest">{t('sort.newest')}</option>
      <option value="price-asc">{t('sort.priceAsc')}</option>
      <option value="price-desc">{t('sort.priceDesc')}</option>
    </select>
  );
}
