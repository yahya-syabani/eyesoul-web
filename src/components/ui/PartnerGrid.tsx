"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { InsurancePartner } from "@/lib/cms/types";
import { useState } from "react";

interface PartnerGridProps {
  partners: InsurancePartner[];
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-50/50 via-white to-white pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
            className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight"
          >
            Accepted Insurances
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.25, 0, 1] }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            We proudly partner with leading vision insurance providers to ensure you receive the best care and coverage seamlessly.
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {partners.map((partner, index) => {
            // FORCE FALLBACK for missing images (can be reverted once CMS media URL issue is resolved)
            const logoUrl = null; // partner.logo && typeof partner.logo === 'object' ? partner.logo.url : null;
            const hasError = imageErrors[partner.id];

            return (
              <motion.div
                key={partner.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] } }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative flex flex-col items-center justify-center p-8 md:p-10 bg-[#F8F9FA] rounded-2xl border border-neutral-100 transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/50 hover:border-neutral-200 hover:bg-white"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {logoUrl && !hasError ? (
                  <img 
                    src={logoUrl} 
                    alt={partner.name} 
                    className="h-10 md:h-12 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    onError={() => setImageErrors(prev => ({ ...prev, [partner.id]: true }))}
                  />
                ) : (
                  <div className="flex flex-col items-center text-center gap-3 w-full">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-primary group-hover:shadow-md transition-all duration-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="font-display font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors duration-500 leading-tight">
                      {partner.name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
