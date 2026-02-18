"use client";

import { motion } from "framer-motion";

interface LocationProps {
  city?: string;
  department?: string;
  neighborhood?: string;
  country?: string;
  /** Heure de la cérémonie (ex. "14h00") */
  ceremonyTime?: string;
}

export function Location({
  city = "Sibiti",
  department = "La Lékoumou",
  neighborhood = "Quartier Numéro 1",
  country = "Congo-Brazzaville",
  ceremonyTime = "14h00",
}: LocationProps) {
  const mapsQuery = encodeURIComponent(`${city}, ${department}, ${country}`);

  return (
    <section id="lieu" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6 bg-champagne-50/50">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl sm:text-4xl text-stone-800 mb-6 sm:mb-8"
        >
          Lieu de la cérémonie
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-rose-600 font-medium text-lg sm:text-xl">
            Cérémonie à {ceremonyTime}
          </p>
          <p className="text-stone-700 text-lg sm:text-xl leading-relaxed">
            {neighborhood}
            <br />
            <span className="font-medium">{city}</span>, Département de {department}
            <br />
            <span className="text-stone-600">{country}</span>
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-400 text-white hover:bg-rose-500 transition font-medium text-sm touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Voir sur la carte
          </a>
        </motion.div>
      </div>
    </section>
  );
}
