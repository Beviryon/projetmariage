"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getAllMedia } from "@/lib/firestore";
import { getHeroBackgroundUrl } from "@/lib/cloudinary";
import { Countdown } from "./Countdown";

const SLIDE_DURATION_MS = 5000;

interface HeroProps {
  names?: string;
  date?: string;
  /** Date du mariage au format ISO (ex. 2026-02-21) pour le compteur à rebours */
  weddingDateISO?: string;
  /** Heure du mariage (ex. 14 pour 14h) */
  weddingHour?: number;
  coverImage?: string;
}

export function Hero({ names = "Berges & Brest", date = "21 février 2026", weddingDateISO = "2026-02-21", weddingHour = 14 }: HeroProps) {
  const [backgroundUrls, setBackgroundUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getAllMedia().then((list) => {
      const images = list.filter((m) => m.type === "image").slice(0, 8);
      const urls = images.map((m) => getHeroBackgroundUrl(m.cloudinaryId)).filter(Boolean);
      setBackgroundUrls(urls);
    });
  }, []);

  useEffect(() => {
    if (backgroundUrls.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % backgroundUrls.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [backgroundUrls.length]);

  const hasImages = backgroundUrls.length > 0;
  const isDark = hasImages;

  return (
    <section className="relative min-h-[100dvh] min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond */}
      {hasImages ? (
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={backgroundUrls[currentIndex]}
                alt=""
                fill
                className="object-cover scale-105"
                sizes="100vw"
                priority
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(165deg,_#fafaf9_0%,_#f5f0eb_50%,_#fef7f0_100%)]" />
      )}

      {/* Contenu */}
      <div className="relative z-10 w-full px-3 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-4xl mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`text-center ${isDark ? "py-8 px-4 sm:py-10 sm:px-12 rounded-2xl sm:rounded-3xl bg-black/50 backdrop-blur-sm" : ""}`}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-block text-sm sm:text-base font-medium tracking-[0.3em] uppercase mb-6 ${
              isDark ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]" : "text-stone-500"
            }`}
          >
            Bienvenue
          </motion.span>

          <h1
            className={`font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-4 sm:mb-5 ${
              isDark ? "text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.5)]" : "text-stone-800"
            }`}
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              className="block"
            >
              {names}
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className={`w-16 h-px mx-auto mb-6 ${isDark ? "bg-white/60" : "bg-stone-300"}`}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className={`font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-light tracking-wide ${
              isDark ? "text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]" : "text-stone-600"
            }`}
          >
            {date} à {String(weddingHour).padStart(2, "0")}h00
          </motion.p>

          <Countdown
            targetDate={new Date(`${weddingDateISO}T${String(weddingHour).padStart(2, "0")}:00:00`)}
            isDark={isDark}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`mt-8 max-w-lg mx-auto text-base sm:text-lg leading-relaxed ${
              isDark ? "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]" : "text-stone-500"
            }`}
          >
            Notre site souvenir : revivez notre jour J à travers la galerie, les moments forts et le
            livre d&apos;or.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-10 sm:mt-12"
          >
            <a
              href="#galerie"
              className={`inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-all duration-300 min-h-[48px] touch-manipulation ${
                isDark
                  ? "bg-white text-stone-800 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-primary-500 text-white hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              Découvrir la galerie
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicateur de défilement (discret) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]"
      >
        <span
          className={`text-xs tracking-widest uppercase ${
            isDark ? "text-white/60" : "text-stone-400"
          }`}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
