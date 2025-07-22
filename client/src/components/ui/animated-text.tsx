import React from "react";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  animation?: "fadeInUp";
  delay?: number;
  staggerChildren?: boolean;
  highlightWords?: string[];
  highlightClass?: string;
}

const animations: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
};

export function AnimatedText({
  text,
  tag = "div",
  className,
  animation = "fadeInUp",
  delay = 0,
  staggerChildren,
  highlightWords = [],
  highlightClass = ""
}: AnimatedTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay }
    })
  };

  const child = animations[animation];

  if (!staggerChildren) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={child}
        className={className}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className={cn(
              highlightWords.includes(word) ? highlightClass : ""
            )}
          >
            {word}{" "}
          </span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className={cn(
            "inline-block",
            highlightWords.includes(word) ? highlightClass : ""
          )}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
}
