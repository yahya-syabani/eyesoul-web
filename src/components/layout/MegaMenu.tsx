"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Brand, EyewearCollection } from '@/lib/cms/types';
import { Category } from '@/lib/cms/categories';

export type MegaMenuTab = "eyewear" | "collections" | "brands" | null;

interface MegaMenuProps {
  activeTab: MegaMenuTab;
  onMouseEnter: (tab: MegaMenuTab) => void;
  onMouseLeave: () => void;
  brands?: Brand[];
  collections?: EyewearCollection[];
  categories?: Category[];
}

export function MegaMenu({ activeTab, onMouseEnter, onMouseLeave, brands = [], collections = [], categories = [] }: MegaMenuProps) {
  const t = useTranslations("Navigation");

  const tabContents = {
    eyewear: {
      columns: [
        {
          title: "Optical",
          links: [
            { label: "Men's Optical", href: "/products?category=frames&gender=men" },
            { label: "Women's Optical", href: "/products?category=frames&gender=women" },
            { label: "Blue Light Protection", href: "/products?category=frames&feature=blue-light" },
          ]
        },
        {
          title: "Sunglasses",
          links: [
            { label: "Men's Sunglasses", href: "/products?category=sunglasses&gender=men" },
            { label: "Women's Sunglasses", href: "/products?category=sunglasses&gender=women" },
            { label: "Polarized", href: "/products?category=sunglasses&feature=polarized" },
          ]
        },
        {
          title: "Discover",
          links: [
            { label: "New Arrivals", href: "/products?sort=newest" },
            { label: "Best Sellers", href: "/products?sort=popular" },
            { label: "View All", href: "/products", highlight: true },
          ]
        }
      ],
      campaign: {
        image: "/campaign-fallback.svg",
        title: "The Titanium Series",
        subtitle: "Ultralight Comfort",
        link: "/collections/titanium",
        linkText: "Explore Collection"
      }
    },
    collections: {
      columns: [
        {
          title: "Featured",
          links: collections.slice(0, 5).map(c => ({
            label: c.name,
            href: `/collections/${c.slug}`
          }))
        },
        {
          title: "Discover",
          links: [
            { label: "View All Collections", href: "/collections", highlight: true },
          ]
        }
      ],
      campaign: {
        image: collections[0]?.coverImage && typeof collections[0].coverImage === 'object' ? collections[0].coverImage.url : "/campaign-fallback.svg",
        title: collections[0]?.name || "New Collection",
        subtitle: "Featured",
        link: collections[0] ? `/collections/${collections[0].slug}` : "/collections",
        linkText: "View Lookbook"
      }
    },
    brands: {
      columns: [
        {
          title: "Featured",
          links: brands.slice(0, 5).map(b => ({
            label: b.name,
            href: `/brands/${b.slug}`
          }))
        },
        {
          title: "Discover",
          links: [
            { label: "View All Brands", href: "/brands", highlight: true },
          ]
        }
      ],
      campaign: {
        image: "/campaign-fallback.svg", // Brands don't have a cover image in the schema, using fallback
        title: brands[0]?.name || "Featured Brand",
        subtitle: "Partner",
        link: brands[0] ? `/brands/${brands[0].slug}` : "/brands",
        linkText: "Shop Now"
      }
    }
  };

  const content = activeTab ? tabContents[activeTab] : null;

  return (
    <AnimatePresence>
      {activeTab && content && (
        <motion.div
          initial={{ opacity: 0, y: -5, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // custom spring-like ease
          onMouseEnter={() => onMouseEnter(activeTab)}
          onMouseLeave={onMouseLeave}
          className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-border shadow-sm z-40 hidden md:block"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-12 gap-8">
              
              {/* Links Sections (8 cols) */}
              <div className="col-span-8 grid grid-cols-3 gap-8">
                {content.columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col space-y-4">
                    <h4 className="font-display text-xs tracking-widest uppercase text-muted-foreground mb-3">{col.title}</h4>
                    {col.links.map((link, linkIdx) => (
                      <Link 
                        key={linkIdx} 
                        href={link.href} 
                        onClick={onMouseLeave}
                        className={`hover:text-primary transition-colors ${'highlight' in link && link.highlight ? "text-sm font-medium mt-2 pt-4 border-t border-border/50 inline-block w-max" : "text-[15px]"}`}
                      >
                        {link.label} {'highlight' in link && link.highlight && <span className="ml-1">&rarr;</span>}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              {/* Featured Campaign (4 cols) */}
              <div className="col-span-4 pl-8 border-l border-border/50">
                <div className="flex flex-col">
                  <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden group rounded-sm mb-6">
                    <Image
                      src={content.campaign.image}
                      alt={content.campaign.title}
                      fill
                      sizes="33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[0.25,0.25,0,1]"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
                  </div>
                  <h5 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{content.campaign.subtitle}</h5>
                  <h4 className="font-display text-xl mb-3">{content.campaign.title}</h4>
                  <Link href={content.campaign.link} onClick={onMouseLeave} className="text-sm font-medium hover:text-primary transition-colors inline-block w-max">
                    {content.campaign.linkText} <span className="ml-1">&rarr;</span>
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
