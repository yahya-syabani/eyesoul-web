"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteSettings } from '@/lib/cms/types';

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const t = useTranslations('Navigation');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white pt-24 pb-8 overflow-hidden">
      <div className="container">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-16 mb-16">
          <div className="max-w-xl mb-8 md:mb-0">
            <h3 className="font-display text-3xl md:text-5xl mb-4 font-light">Join the list.</h3>
            <p className="text-neutral-400 text-sm">
              Subscribe to receive updates on new arrivals, exclusive releases, and early access to collaborations.
            </p>
          </div>
          <form className="w-full md:max-w-md flex relative" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus:border-white transition-colors"
              required
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1 hover:bg-transparent hover:text-neutral-300">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight uppercase">
              Eyesoul
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              {siteSettings?.siteTagline || 'Quiet luxury, custom acetate, lightweight feel. Premium eyewear crafted for the discerning. Experience vision without compromise.'}
            </p>
            <div className="flex space-x-5 pt-4">
              {siteSettings?.socialLinks?.twitter && (
                <a href={siteSettings.socialLinks.twitter} className="text-neutral-400 hover:text-white transition-colors text-sm" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {siteSettings?.socialLinks?.linkedin && (
                <a href={siteSettings.socialLinks.linkedin} className="text-neutral-400 hover:text-white transition-colors text-sm" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {siteSettings?.socialLinks?.github && (
                <a href={siteSettings.socialLinks.github} className="text-neutral-400 hover:text-white transition-colors text-sm" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {(!siteSettings?.socialLinks?.twitter && !siteSettings?.socialLinks?.linkedin && !siteSettings?.socialLinks?.github) && (
                <>
                  <a href="https://instagram.com" className="text-neutral-400 hover:text-white transition-colors text-sm" aria-label="Instagram">Instagram</a>
                  <a href="https://facebook.com" className="text-neutral-400 hover:text-white transition-colors text-sm" aria-label="Facebook">Facebook</a>
                </>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">Shop</h4>
            <nav className="flex flex-col space-y-3 text-sm text-neutral-400">
              <Link href="/products?category=frames" className="hover:text-white transition-colors">Optical Frames</Link>
              <Link href="/products?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</Link>
              <Link href="/collections" className="hover:text-white transition-colors">All {t('collections')}</Link>
            </nav>
          </div>

          {/* Support Column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">Support</h4>
            <nav className="flex flex-col space-y-3 text-sm text-neutral-400">
              <Link href="/faq" className="hover:text-white transition-colors">{t('faq')}</Link>
              <Link href="/services/repairs" className="hover:text-white transition-colors">Repairs & Warranty</Link>
              <Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link>
              <Link href="/store-locator" className="hover:text-white transition-colors">{t('stores')}</Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">Contact</h4>
            <div className="flex flex-col space-y-4 text-sm text-neutral-400">
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 group-hover:text-white transition-colors" />
                <span className="whitespace-pre-line">{siteSettings?.address || '123 Optical Avenue, Design District, NY 10012'}</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="h-4 w-4 shrink-0 group-hover:text-white transition-colors" />
                <a href={`mailto:${siteSettings?.contactEmail || 'hello@eyesoul.com'}`} className="hover:text-white transition-colors">
                  {siteSettings?.contactEmail || 'hello@eyesoul.com'}
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-4 w-4 shrink-0 group-hover:text-white transition-colors" />
                <a href={`tel:${siteSettings?.phone?.replace(/[^0-9+]/g, '') || '+1234567890'}`} className="hover:text-white transition-colors">
                  {siteSettings?.phone || '+1 (234) 567-890'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-neutral-500">
          <p>&copy; {currentYear} Eyesoul. All rights reserved.</p>
          
          <div className="flex space-x-4 my-4 md:my-0 text-neutral-600 font-display tracking-widest uppercase">
            {/* Trust Markers - Simple Typography */}
            <span>Zeiss Partner</span>
            <span>&bull;</span>
            <span>Secure Checkout</span>
          </div>

          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
