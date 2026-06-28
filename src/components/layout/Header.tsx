"use client";

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Search, Heart, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MegaMenu, MegaMenuTab } from './MegaMenu';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { Brand, EyewearCollection } from '@/lib/cms/types';
import { Category } from '@/lib/cms/categories';

interface HeaderProps {
  brands?: Brand[];
  collections?: EyewearCollection[];
  categories?: Category[];
}

export function Header({ brands = [], collections = [], categories = [] }: HeaderProps) {
  const t = useTranslations('Navigation');
  const tHeader = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<MegaMenuTab>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const toggleLocale = locale === 'en' ? 'id' : 'en';

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Transparent vs Solid
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Mega menu handlers
  let timeoutId: NodeJS.Timeout;
  const handleMouseEnter = (tab: MegaMenuTab) => {
    clearTimeout(timeoutId);
    setActiveTab(tab);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setActiveTab(null);
    }, 150);
  };

  return (
    <>
      <header
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled || activeTab !== null
            ? "bg-background/80 backdrop-blur-2xl border-b border-border text-foreground"
            : "bg-transparent text-foreground border-transparent"
        }`}
      >
        <div className="container h-16 flex items-center justify-between">
          
          {/* Left: Mobile Menu & Desktop Navigation */}
          <div className="flex items-center gap-6 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              aria-label={tHeader('menu')}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <nav className="hidden lg:flex gap-8 text-[13px] uppercase tracking-widest font-medium h-full items-center">
              <div 
                className="h-16 flex items-center cursor-pointer hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("eyewear")}
              >
                Eyewear
              </div>
              <div 
                className="h-16 flex items-center cursor-pointer hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("collections")}
              >
                {t('collections')}
              </div>
              <div 
                className="h-16 flex items-center cursor-pointer hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("brands")}
              >
                {t('brands')}
              </div>
              <Link 
                href="/articles" 
                className="h-16 flex items-center hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter(null)}
              >
                Journal
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link 
              href="/" 
              className="font-display text-3xl font-semibold tracking-widest uppercase"
              onMouseEnter={() => handleMouseEnter(null)}
            >
              Eyesoul
            </Link>
          </div>

          {/* Right: Utilities */}
          <div className="flex items-center justify-end gap-3 flex-1">
            <Button variant="ghost" size="icon" aria-label={tHeader('search')} className="hover:bg-transparent hover:opacity-70 transition-opacity">
              <Search className="h-5 w-5 stroke-[1.5]" />
            </Button>
            
            <Button variant="ghost" size="icon" aria-label={tHeader('wishlist')} className="hover:bg-transparent hover:opacity-70 transition-opacity">
              <Heart className="h-5 w-5 stroke-[1.5]" />
            </Button>
            
            <Link href={pathname} locale={toggleLocale} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity px-2 py-2">
              <Globe className="h-4 w-4 stroke-[1.5]" />
              <span className="uppercase text-xs tracking-wider">{locale}</span>
            </Link>
          </div>
        </div>
        
        {/* Mega Menu Overlay */}
        <MegaMenu 
          activeTab={activeTab} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          brands={brands}
          collections={collections}
          categories={categories}
        />
      </header>
      
      {/* Mobile Drawer */}
      <MobileMenuDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        brands={brands}
        collections={collections}
        categories={categories}
      />
    </>
  );
}
