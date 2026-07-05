"use client";

import { useTranslations } from 'next-intl';
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck, Quote } from "lucide-react";
import { Testimonial } from "@/lib/cms/types";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const homeT = useTranslations('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-24 md:py-32 bg-neutral-950 text-white overflow-hidden relative selection:bg-white/20">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-800/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-neutral-400 uppercase tracking-widest text-xs font-semibold mb-6">
            {homeT('testimonials.title')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            The Eyesoul Experience
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative h-[450px] md:h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  handleNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrev();
                }
              }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {/* Card Content */}
              <div className="w-full h-full p-8 md:p-14 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] flex flex-col items-center justify-between text-center relative shadow-2xl">
                <Quote className="absolute top-8 left-8 w-12 h-12 text-white/5 rotate-180 pointer-events-none" />
                <Quote className="absolute bottom-8 right-8 w-12 h-12 text-white/5 pointer-events-none" />

                <div className="flex items-center gap-1.5 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? "text-amber-400 fill-amber-400" : "text-neutral-700"}`}
                    />
                  ))}
                </div>

                <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light leading-snug tracking-tight mb-10 text-neutral-100">
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </blockquote>

                <div className="flex flex-col items-center gap-4">
                  {testimonials[currentIndex].avatar && typeof testimonials[currentIndex].avatar === "object" ? (
                    <img
                      src={testimonials[currentIndex].avatar.url}
                      alt={testimonials[currentIndex].author}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/20 shadow-lg">
                      <span className="text-xl font-display text-neutral-300">
                        {testimonials[currentIndex].author.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <p className="font-display font-medium text-lg text-white">{testimonials[currentIndex].author}</p>
                      <BadgeCheck className="w-5 h-5 text-blue-400" aria-label="Verified Customer" />
                    </div>
                    {testimonials[currentIndex].company && (
                      <p className="text-sm text-neutral-400 mt-1">{testimonials[currentIndex].company}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mt-16">
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-950"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className="group p-2 focus:outline-none"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex ? "w-10 bg-white" : "w-2 bg-white/20 group-hover:bg-white/40"}`} />
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-950"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
