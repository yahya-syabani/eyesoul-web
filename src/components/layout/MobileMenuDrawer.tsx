"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, EyewearCollection } from '@/lib/cms/types';
import { Category } from '@/lib/cms/categories';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brands?: Brand[];
  collections?: EyewearCollection[];
  categories?: Category[];
}

export function MobileMenuDrawer({ isOpen, onClose, brands = [], collections = [], categories = [] }: MobileMenuDrawerProps) {
  const links = [
    { label: "Optical", href: "/products?category=frames" },
    { label: "Sunglasses", href: "/products?category=sunglasses" },
    { label: "Collections", href: "/collections" },
    { label: "Brands", href: "/brands" },
    { label: "Journal", href: "/articles" },
    { label: "Stores", href: "/store-locator" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm bg-background border-l border-border shadow-2xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-border/50">
              <span className="font-display font-semibold tracking-widest uppercase text-xl">
                Menu
              </span>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                <X className="h-6 w-6 stroke-[1.5]" />
              </Button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col space-y-6">
              {links.map((link, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={onClose}
                    className="font-display text-4xl font-light hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer / Utilities */}
            <div className="mt-auto px-6 py-8 border-t border-border/50 bg-neutral-50 flex flex-col space-y-4">
              <Link href="/faq" onClick={onClose} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider">FAQ & Support</Link>
              <Link href="/contact" onClick={onClose} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wider">Contact Us</Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
