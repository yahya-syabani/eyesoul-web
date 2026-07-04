"use client";

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, Globe } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useHoverIntent } from '@/lib/hooks/useHoverIntent';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { activeItem: activeTab, handleMouseEnter, handleMouseLeave } = useHoverIntent<MegaMenuTab>(null, 300);
  
  const { scrollY } = useScroll({});
  const toggleLocale = locale === 'en' ? 'id' : 'en';

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Add hysteresis buffer: enter scrolled state > 50px, exit < 20px
    setIsScrolled((prev) => {
      if (!prev && latest > 50) return true;
      if (prev && latest < 20) return false;
      return prev;
    });
  });

  // State derivations
  const isFrosted = isScrolled || activeTab !== null;
  const isShrunk = isScrolled; // Decoupled from activeTab to prevent hit-box shifting!
  const textColor = isFrosted ? "text-foreground" : "text-white";

  return (
    <>
      <header
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 z-50 w-full h-[96px] lg:h-[128px] pointer-events-none"
      >
        <div 
          className={`absolute top-0 left-0 w-full pointer-events-auto transition-all duration-500 ease-in-out flex flex-col justify-center ${
            isFrosted
              ? "bg-background/95 backdrop-blur-2xl border-b border-border shadow-sm h-[64px] lg:h-[80px]"
              : "bg-transparent border-transparent h-[96px] lg:h-[128px]"
          }`}
        >
          <div className="container flex items-center justify-between h-full">
            
            {/* Left: Mobile Menu & Desktop Navigation */}
            <div className="flex items-center gap-6 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`lg:hidden ${textColor}`}
                aria-label={tHeader('menu')}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <nav className={`hidden lg:flex gap-8 text-sm tracking-wide font-medium h-full items-center ${textColor}`}>
                <div 
                  className="h-full flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  onMouseEnter={() => handleMouseEnter("eyewear")}
                >
                  Eyewear
                </div>
                <div 
                  className="h-full flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  onMouseEnter={() => handleMouseEnter("collections")}
                >
                  {t('collections')}
                </div>
                <div 
                  className="h-full flex items-center cursor-pointer hover:opacity-70 transition-opacity"
                  onMouseEnter={() => handleMouseEnter("brands")}
                >
                  {t('brands')}
                </div>
                <Link 
                  href="/services" 
                  className="h-full flex items-center hover:opacity-70 transition-opacity"
                  onMouseEnter={() => handleMouseEnter(null)}
                >
                  {t('services')}
                </Link>
                <Link 
                  href="/articles" 
                  className="h-full flex items-center hover:opacity-70 transition-opacity"
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
                className={`font-display font-semibold tracking-wider uppercase transition-all duration-500 ${
                  isShrunk ? "text-xl lg:text-2xl" : "text-2xl lg:text-3xl"
                } ${textColor}`}
                onMouseEnter={() => handleMouseEnter(null)}
              >
                Eyesoul
              </Link>
            </div>

            {/* Right: Utilities */}
            <div className={`flex items-center justify-end gap-4 flex-1 ${textColor}`}>
              <Link href={pathname} locale={toggleLocale} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity px-2 py-2">
                <Globe className="h-4 w-4 stroke-[1.5]" />
                <span className="uppercase text-xs tracking-wider">{locale}</span>
              </Link>
              <Link 
                href="/store-locator" 
                onClick={() => handleMouseEnter(null)}
                className={`${buttonVariants({ variant: "outline" })} hidden md:flex rounded-none border-current bg-transparent hover:bg-foreground hover:text-background transition-colors ${isFrosted ? 'border-foreground text-foreground' : 'border-white text-white'}`}
              >
                {t('stores')}
              </Link>
            </div>
          </div>

          {/* Mega Menu Overlay */}
          <div className="absolute top-full left-0 w-full">
            <MegaMenu 
              activeTab={activeTab} 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
              brands={brands}
              collections={collections}
              categories={categories}
            />
          </div>
        </div>
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
