"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useCallback, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  dynamicFilters?: FilterSection[];
}

const FALLBACK_CONFIG: FilterSection[] = [
  {
    id: "category",
    label: "Category",
    options: [
      { label: "Frames", value: "frames" },
      { label: "Sunglasses", value: "sunglasses" },
      { label: "Contact Lenses", value: "contact-lenses" },
    ],
  },
  {
    id: "material",
    label: "Material",
    options: [
      { label: "Japanese Titanium", value: "Japanese Titanium" },
      { label: "Italian Acetate", value: "Italian Acetate" },
      { label: "Mixed Media", value: "Mixed Media" },
    ],
  },
  {
    id: "shape",
    label: "Shape",
    options: [
      { label: "Round", value: "Round" },
      { label: "Square", value: "Square" },
      { label: "Aviator", value: "Aviator" },
      { label: "Cat Eye", value: "Cat Eye" },
    ],
  },
];

export function FilterSidebar({ dynamicFilters }: FilterSidebarProps) {
  const t = useTranslations('catalogue');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    material: true,
    shape: true,
    gender: true,
  });

  // Merge dynamic filters into the config, falling back to hardcoded for sections not provided
  const filterConfig: FilterSection[] = FALLBACK_CONFIG.map((fallback) => {
    const dynamic = dynamicFilters?.find((d) => d.id === fallback.id);
    if (dynamic && dynamic.options.length > 0) {
      return dynamic;
    }
    return fallback;
  });

  // Add dynamic-only sections that don't have a fallback (e.g. gender)
  if (dynamicFilters) {
    for (const d of dynamicFilters) {
      if (!FALLBACK_CONFIG.find((f) => f.id === d.id) && d.options.length > 0) {
        filterConfig.push(d);
      }
    }
  }

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterClick = (name: string, value: string) => {
    const qs = createQueryString(name, value);
    router.push(`${pathname}?${qs}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 custom-scrollbar">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h3 className="font-display font-medium text-lg">{t('filters')}</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {filterConfig.map((section) => (
        <div key={section.id} className="border-b border-neutral-100 pb-4 last:border-0">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex w-full items-center justify-between py-2 text-sm font-medium"
          >
            {section.label}
            <ChevronDown 
              className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
                openSections[section.id] ? "rotate-180" : ""
              }`} 
            />
          </button>
          
          <div className={`mt-2 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
            openSections[section.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
            {section.options.map((option) => {
              const isActive = searchParams.get(section.id) === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 text-sm transition-colors text-left py-1 cursor-pointer ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleFilterClick(section.id, option.value)}
                    className="sr-only peer"
                  />
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors peer-checked:bg-foreground peer-checked:border-foreground peer-checked:text-background ${
                    isActive ? "bg-foreground border-foreground text-background" : "border-neutral-300"
                  }`}>
                    {isActive && <X className="w-3 h-3" />}
                  </div>
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
