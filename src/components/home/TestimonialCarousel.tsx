"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Testimonial } from "@/lib/cms/types";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  if (length === 0) return null;

  const t = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-light mb-16">
          What Our Customers Say
        </h2>

        <div className="max-w-2xl mx-auto relative">
          <Card className="border-transparent shadow-sm bg-neutral-50/50">
            <CardContent className="p-8 md:p-12">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`}
                  />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div>
                <p className="font-display font-medium text-foreground">{t.author}</p>
                {t.company && (
                  <p className="text-sm text-muted-foreground mt-1">{t.company}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          {length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrent((current - 1 + length) % length)}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                {current + 1} / {length}
              </span>
              <button
                onClick={() => setCurrent((current + 1) % length)}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
