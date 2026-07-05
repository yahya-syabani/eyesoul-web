"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MapPin, Mail, Phone } from 'lucide-react';
import { SiteSettings } from '@/lib/cms/types';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { FOOTER_SHOP_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/navigation';

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const t = useTranslations('Navigation');
  const f = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white pt-24 pb-8 overflow-hidden">
      <div className="container">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-16 mb-16">
          <div className="max-w-xl mb-8 md:mb-0">
            <h3 className="font-display text-3xl md:text-5xl mb-4 font-light">{f('newsletter.title')}</h3>
            <p className="text-neutral-400 text-sm">
              {f('newsletter.body')}
            </p>
          </div>
          <NewsletterForm />
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
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">{f('shop')}</h4>
            <nav className="flex flex-col space-y-3 text-sm text-neutral-400">
              {FOOTER_SHOP_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                  {link.labelKey.startsWith('footer.') ? f(link.labelKey.replace('footer.', '')) : t(link.labelKey.replace('Navigation.', ''))}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">{f('support')}</h4>
            <nav className="flex flex-col space-y-3 text-sm text-neutral-400">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                  {link.labelKey.startsWith('footer.') ? f(link.labelKey.replace('footer.', '')) : t(link.labelKey.replace('Navigation.', ''))}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white mb-4">{f('contact')}</h4>
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
            <span>{f('trust.zeiss')}</span>
            <span>&bull;</span>
            <span>{f('trust.checkout')}</span>
          </div>

          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">{f('links.privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{f('links.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
