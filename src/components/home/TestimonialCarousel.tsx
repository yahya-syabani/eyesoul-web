"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";
import { Testimonial } from "@/lib/cms/types";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  if (length === 0) return null;

  const t = testimonials[current];
  const avatarUrl = t.avatar && typeof t.avatar === "object" ? t.avatar.url : null;

  return (
    <section className="py-24 md:py-32 bg-[#F9F9F9]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Title & Controls */}
          <div className="w-full lg:w-1/3 flex flex-col justify-between">
            <div>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold mb-6">
                Client Experiences
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light mb-8 tracking-tight">
                The Eyesoul<br className="hidden lg:block" /> Experience
              </h2>
            </div>
            
            {/* Navigation Controls (Fixed placement so they don't jump) */}
            {length > 1 && (
              <div className="hidden lg:flex items-center gap-6 mt-12">
                <button
                  onClick={() => setCurrent((current - 1 + length) % length)}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className="group p-2"
                      aria-label={`Go to testimonial ${index + 1}`}
                    >
                      <div className={`h-1 transition-all duration-300 rounded-full ${index === current ? "w-8 bg-neutral-900" : "w-2 bg-neutral-300 group-hover:bg-neutral-400"}`} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((current + 1) % length)}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sliding Reviews */}
          <div className="w-full lg:w-2/3 relative min-h-[400px] lg:min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Large elegant quote */}
                <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-neutral-900 font-light leading-snug tracking-tight mb-12">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Metadata Row */}
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-6 pt-8 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                        <img src={avatarUrl} alt={t.author} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="relative w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                        <span className="text-xl font-display text-neutral-500">{t.author.charAt(0)}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-medium text-lg text-neutral-900">{t.author}</p>
                        <BadgeCheck className="w-4 h-4 text-blue-500" aria-label="Verified Customer" />
                      </div>
                      {t.company && (
                        <p className="text-sm text-neutral-500">{t.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Stars (Pushed to right on desktop) */}
                  <div className="sm:ml-auto flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`}
                      />
                    ))}
                    <span className="text-sm font-medium text-neutral-700 ml-2">{t.rating}.0</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Mobile Navigation Controls */}
          {length > 1 && (
            <div className="flex lg:hidden items-center justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={() => setCurrent((current - 1 + length) % length)}
                className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className="p-1"
                    aria-label={`Go to testimonial ${index + 1}`}
                  >
                    <div className={`h-1.5 transition-all duration-300 rounded-full ${index === current ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"}`} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrent((current + 1) % length)}
                className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
