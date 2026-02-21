"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaByMoment } from "@/lib/firestore";
import { getBannerMediaUrl } from "@/lib/cloudinary";
import type { Media } from "@/lib/types";

const STORAGE_KEY = "ceremony_modal_closed";
const AUTO_SHOW_DELAY_MS = 2000;
const SLIDE_DURATION_MS = 5500;

export function CeremonyModal() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getMediaByMoment("banniere").then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  // Auto-ouvrir une fois par session si pas déjà fermé
  useEffect(() => {
    if (loading || items.length === 0) return;
    const closed = typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY);
    if (closed) return;
    const t = setTimeout(() => setIsOpen(true), AUTO_SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [loading, items.length]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % Math.max(1, items.length));
  }, [items.length]);

  useEffect(() => {
    if (!isOpen || items.length <= 1) return;
    const current = items[currentIndex];
    if (current?.type === "video") return;
    const t = setInterval(goNext, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [isOpen, items, currentIndex, goNext]);

  if (loading || items.length === 0) return null;

  const current = items[currentIndex];
  const isVideo = current?.type === "video";
  const mediaUrl = current ? getBannerMediaUrl(current.cloudinaryId, current.type) : "";

  return (
    <>
      {/* Bouton flottant pour rouvrir le modal */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-4 sm:right-6 z-[180] flex items-center gap-2 px-4 py-3 rounded-full bg-primary-500 text-white text-sm font-medium shadow-lg hover:bg-primary-600 active:scale-[0.98] transition touch-manipulation pb-[env(safe-area-inset-bottom)]"
            aria-label="Suivre la cérémonie"
          >
            <span className="inline-flex w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
            Suivre la cérémonie
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ceremony-modal-title"
          >
            <div className="absolute inset-0 bg-black/70" aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-stone-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* En-tête */}
              <div className="flex items-center justify-between shrink-0 px-4 py-3 bg-stone-800/80 border-b border-stone-700">
                <h2 id="ceremony-modal-title" className="font-serif text-lg sm:text-xl text-white">
                  Suivez la cérémonie
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-600 transition touch-manipulation"
                  aria-label="Fermer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Carousel */}
              <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black aspect-video max-h-[70vh]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${current?.id}-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {isVideo ? (
                      <video
                        ref={videoRef}
                        src={mediaUrl}
                        className="w-full h-full object-contain bg-black"
                        playsInline
                        controls
                        autoPlay
                        onEnded={goNext}
                        aria-label="Vidéo de la cérémonie"
                      />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={current?.caption || "Image de la cérémonie"}
                        fill
                        className="object-contain"
                        sizes="(max-width: 896px) 100vw, 896px"
                        unoptimized
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Indicateurs */}
                {items.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all touch-manipulation ${
                          i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
