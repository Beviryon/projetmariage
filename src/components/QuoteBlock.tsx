"use client";

import { motion } from "framer-motion";

interface QuoteBlockProps {
  quote: string;
  author?: string;
}

export function QuoteBlock({ quote, author }: QuoteBlockProps) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center py-6 sm:py-10 px-4"
    >
      <p
        className="font-serif text-lg sm:text-xl md:text-2xl text-stone-600 italic leading-relaxed"
        style={{ fontFamily: "var(--font-playfair), serif" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      {author && (
        <cite className="mt-3 block text-sm text-stone-500 not-italic">— {author}</cite>
      )}
    </motion.blockquote>
  );
}
