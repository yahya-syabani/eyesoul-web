"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
}

export function SearchDialog() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${CMS_URL}/api/products?depth=0&limit=8&where[name][contains]=${encodeURIComponent(q)}&locale=${locale}`
      );
      const data = await res.json();
      setResults(data.docs || []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity px-2 py-2"
        aria-label={t('search')}
        title="Ctrl+K to search"
      >
        <Search className="h-4 w-4 stroke-[1.5]" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center pt-[15vh] bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
          />
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">Searching...</div>
          )}
          {!isLoading && query && results.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No results found for &quot;{query}&quot;</div>
          )}
          {!isLoading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => { setIsOpen(false); setQuery(""); }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors group"
                >
                  <span className="font-medium text-sm">{product.name}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}
          {!query && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Type to search products... (Ctrl+K)
            </div>
          )}
        </div>
      </div>
      {/* Click outside to close */}
      <div className="flex-1 w-full" onClick={() => setIsOpen(false)} />
    </div>
  );
}
