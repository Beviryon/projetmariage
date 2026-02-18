"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "line" | "heart" | "ring" | "leaf";
  quote?: string;
}

const icons = {
  line: (
    <span className="w-2 h-2 rounded-full bg-primary-400" aria-hidden />
  ),
  heart: (
    <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  ring: (
    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
    </svg>
  ),
  leaf: (
    <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.39-2.79.02.02c.74-1.48 1.66-2.92 2.7-4.16C14.07 12.94 17 11 17 8z" />
    </svg>
  ),
};

export function SectionDivider({ variant = "heart", quote }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-8 sm:py-12 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center gap-4 w-full max-w-md mx-auto px-4">
        <span className="flex-1 h-px bg-champagne-300" aria-hidden />
        <span className="shrink-0">{icons[variant]}</span>
        <span className="flex-1 h-px bg-champagne-300" aria-hidden />
      </div>
      {quote && (
        <blockquote className="text-center px-4 max-w-xl">
          <p
            className="font-serif text-base sm:text-lg text-stone-600 italic"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>
      )}
    </motion.div>
  );
}
