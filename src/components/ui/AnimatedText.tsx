"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import React from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: React.ElementType;
  once?: boolean;
}

export function AnimatedText({
  text,
  className = "",
  el: Wrapper = "p",
  once = true,
}: AnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const defaultAnimations: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <Wrapper className={className} ref={ref}>
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.05 }}
        aria-hidden="true"
        className="inline-block"
      >
        {text.split(" ").map((word, wordIndex) => (
          <span className="inline-block overflow-hidden" key={`${word}-${wordIndex}`}>
            <motion.span
              className="inline-block"
              variants={defaultAnimations}
            >
              {word}
            </motion.span>
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
      <span className="sr-only">{text}</span>
    </Wrapper>
  );
}
