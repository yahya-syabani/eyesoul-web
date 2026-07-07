"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { X, MapPin, ChevronDown, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import { Brand, EyewearCollection, Service } from '@/lib/cms/types';
import { Category } from '@/lib/cms/categories';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brands?: Brand[];
  collections?: EyewearCollection[];
  categories?: Category[];
  services?: Service[];
  onSearchOpen?: () => void;
}

const accordionVariants = {
  open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

export function MobileMenuDrawer({ isOpen, onClose, brands = [], collections = [], categories = [], services = [], onSearchOpen }: MobileMenuDrawerProps) {
  const t = useTranslations('Navigation');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  const linkClass = "block py-2.5 text-base font-medium text-neutral-700 hover:text-foreground transition-colors";
  const childLinkClass = "block py-2 pl-6 text-sm text-muted-foreground hover:text-foreground transition-colors";

  const sections = [
    {
      id: "eyewear",
      label: t('eyewear'),
      children: (
        <div className="pb-2 space-y-0.5">
          <Link href="/products?category=frames" onClick={onClose} className={childLinkClass}>Optical Frames</Link>
          <Link href="/products?category=sunglasses" onClick={onClose} className={childLinkClass}>Sunglasses</Link>
          <Link href="/products" onClick={onClose} className={childLinkClass}>View All Eyewear</Link>
        </div>
      ),
    },
    {
      id: "collections",
      label: t('collections'),
      children: (
        <div className="pb-2 space-y-0.5">
          {collections.slice(0, 6).map(c => (
            <Link key={c.id} href={`/collections/${c.slug}`} onClick={onClose} className={childLinkClass}>{c.name}</Link>
          ))}
          <Link href="/collections" onClick={onClose} className={`${childLinkClass} font-medium text-foreground`}>View All Collections</Link>
        </div>
      ),
    },
    {
      id: "brands",
      label: t('brands'),
      children: (
        <div className="pb-2 space-y-0.5">
          {brands.slice(0, 6).map(b => (
            <Link key={b.id} href={`/brands/${b.slug}`} onClick={onClose} className={childLinkClass}>{b.name}</Link>
          ))}
          <Link href="/brands" onClick={onClose} className={`${childLinkClass} font-medium text-foreground`}>View All Brands</Link>
        </div>
      ),
    },
    {
      id: "services",
      label: t('services'),
      children: (
        <div className="pb-2 space-y-0.5">
          {services.slice(0, 4).map(s => (
            <Link key={s.id} href={`/services/${s.slug}`} onClick={onClose} className={childLinkClass}>{s.name}</Link>
          ))}
          <Link href="/services" onClick={onClose} className={`${childLinkClass} font-medium text-foreground`}>View All Services</Link>
        </div>
      ),
    },
  ];

  const standaloneLinks = [
    { label: t('journal'), href: "/articles" },
    { label: t('stores'), href: "/store-locator" },
    { label: t('contact'), href: "/contact" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-background border-l border-border shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header with search */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
              <span className="font-display font-semibold tracking-widest uppercase text-lg">Menu</span>
              <div className="flex items-center gap-2">
                {onSearchOpen && (
                  <Button variant="ghost" size="icon" onClick={() => { onSearchOpen(); onClose(); }} aria-label="Search">
                    <Search className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                  <X className="h-5 w-5 stroke-[1.5]" />
                </Button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Accordion sections */}
              <div className="px-6 divide-y divide-neutral-100">
                {sections.map(section => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between py-4 text-lg font-display font-medium hover:text-primary transition-colors"
                    >
                      {section.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${openSection === section.id ? "rotate-180" : ""}`}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={openSection === section.id ? "open" : "closed"}
                      variants={accordionVariants}
                      className="overflow-hidden"
                    >
                      {section.children}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Standalone links */}
              <div className="px-6 mt-6 pt-4 border-t border-neutral-100 space-y-1">
                {standaloneLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={onClose} className={linkClass}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-6 py-6 border-t border-border/50 bg-neutral-50 flex flex-col space-y-3">
              <Link href="/store-locator" onClick={onClose} className={`${buttonVariants({ size: "lg" })} w-full justify-center gap-2 rounded-none`}>
                <MapPin className="w-4 h-4" />
                {t('stores')}
              </Link>
              <Link href="/faq" onClick={onClose} className="text-xs font-medium hover:text-primary transition-colors uppercase tracking-wider text-center">FAQ & Support</Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
