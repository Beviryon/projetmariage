"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MOMENTS } from "@/lib/cloudinary";
import { getPlaylist } from "@/lib/firestore";
import type { PlaylistItem } from "@/lib/types";
import type { MomentKey } from "@/lib/types";

export function YouTubePlayer() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getPlaylist().then(setPlaylist);
  }, []);

  const current = playlist[currentIndex];

  if (!playlist.length || !current) {
    return (
      <div className="py-12 text-center text-stone-500">
        La playlist sera bientôt disponible.
      </div>
    );
  }

  const goNext = () => {
    setCurrentIndex((i) => (i < playlist.length - 1 ? i + 1 : 0));
  };

  const goPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : playlist.length - 1));
  };

  const byMoment = playlist.reduce((acc, item) => {
    const m = item.moment as MomentKey;
    if (!acc[m]) acc[m] = [];
    acc[m].push(item);
    return acc;
  }, {} as Record<MomentKey, PlaylistItem[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      <div className="md:col-span-2 space-y-3 sm:space-y-4 order-1">
        <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${current.youtubeVideoId}?autoplay=0`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg sm:text-xl text-stone-800 truncate">{current.title}</h3>
            <p className="text-rose-400 text-sm mt-1">
              {MOMENTS[current.moment as MomentKey]}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={goPrev}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-champagne-200 hover:bg-champagne-300 flex items-center justify-center transition touch-manipulation"
              aria-label="Précédent"
            >
              <svg className="w-6 h-6 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-champagne-200 hover:bg-champagne-300 flex items-center justify-center transition touch-manipulation"
              aria-label="Suivant"
            >
              <svg className="w-6 h-6 text-stone-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 order-2">
        <h4 className="font-serif text-lg text-stone-800">Playlist</h4>
        <div className="space-y-6 max-h-[280px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto hide-scrollbar">
          {(Object.keys(MOMENTS) as MomentKey[]).map((moment) => {
            const items = byMoment[moment] || [];
            if (!items.length) return null;

            return (
              <div key={moment}>
                <p className="text-rose-400 text-sm font-medium mb-2">
                  {MOMENTS[moment]}
                </p>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={item.id}>
                      <button
                        onClick={() =>
                          setCurrentIndex(playlist.findIndex((p) => p.id === item.id))
                        }
                        className={`w-full text-left py-2.5 px-3 rounded-lg transition text-sm touch-manipulation ${
                          current.id === item.id
                            ? "bg-rose-100 text-rose-700"
                            : "hover:bg-champagne-100 text-stone-600"
                        }`}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
