"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaByMoment } from "@/lib/firestore";
import { getBannerMediaUrl } from "@/lib/cloudinary";
import type { Media } from "@/lib/types";

const SLIDE_DURATION_MS = 5500;

export function MediaBanner() {
  const [items, setItems] = useState<Media[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getMediaByMoment("banniere").then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % Math.max(1, items.length));
  }, [items.length]);

  // Auto-advance for images; video advances on ended
  useEffect(() => {
    if (items.length <= 1) return;
    const current = items[currentIndex];
    if (current?.type === "video") return; // video uses onEnded
    const t = setInterval(goNext, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [items, currentIndex, goNext]);

  if (loading || items.length === 0) return null;

  const current = items[currentIndex];
  const isVideo = current?.type === "video";
  const mediaUrl = current ? getBannerMediaUrl(current.cloudinaryId, current.type) : "";

  return (
    <section
      className="relative w-full overflow-hidden bg-stone-200"
      aria-label="Bannière à l'affiche"
    >
      <div className="relative aspect-[16/6] min-h-[200px] sm:min-h-[280px] max-h-[50vh] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${current?.id}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
                autoPlay
                onEnded={goNext}
                aria-label="Vidéo à l'affiche"
              />
            ) : (
              <Image
                src={mediaUrl}
                alt={current?.caption || "Image à l'affiche"}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs */}
        {items.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all touch-manipulation ${
                    i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Voir le slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
