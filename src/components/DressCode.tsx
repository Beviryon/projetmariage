"use client";

import { motion } from "framer-motion";

interface DressCodeProps {
  color?: string;
  description?: string;
}

export function DressCode({
  color = "bleu foncé",
  description = "Nous vous invitons à porter une tenue aux tons bleu foncé pour célébrer ce jour avec nous.",
}: DressCodeProps) {
  return (
    <section id="dress-code" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl sm:text-4xl text-stone-800 mb-6"
        >
          Dress code
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-stone-300 shadow-inner"
              style={{ backgroundColor: "#1e3a5f" }}
              aria-hidden
            />
            <p className="font-serif text-xl sm:text-2xl text-stone-800" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {color}
            </p>
          </div>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
