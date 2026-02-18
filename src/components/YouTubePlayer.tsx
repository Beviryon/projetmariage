"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOMENTS } from "@/lib/cloudinary";
import { getPlaylist } from "@/lib/firestore";
import type { PlaylistItem } from "@/lib/types";
import type { MomentKey } from "@/lib/types";

type MomentFilter = MomentKey | "all";

export function YouTubePlayer() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [momentFilter, setMomentFilter] = useState<MomentFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterLabel = momentFilter === "all" ? "Tous" : MOMENTS[momentFilter];

  useEffect(() => {
    getPlaylist().then(setPlaylist);
  }, []);

  const filteredPlaylist =
    momentFilter === "all"
      ? playlist
      : playlist.filter((p) => p.moment === momentFilter);
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredPlaylist.length - 1));
  const current = filteredPlaylist[safeIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [momentFilter]);

  useEffect(() => {
    if (currentIndex >= filteredPlaylist.length && filteredPlaylist.length > 0) {
      setCurrentIndex(filteredPlaylist.length - 1);
    }
  }, [filteredPlaylist.length, currentIndex]);

  if (!playlist.length) {
    return (
      <div className="py-12 text-center text-stone-500">
        La playlist sera bientôt disponible.
      </div>
    );
  }

  if (!filteredPlaylist.length) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMomentFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${momentFilter === "all" ? "bg-primary-500 text-white" : "bg-champagne-100 text-stone-600"}`}
          >
            Tous
          </button>
          {(Object.keys(MOMENTS) as MomentKey[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMomentFilter(m)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${momentFilter === m ? "bg-primary-500 text-white" : "bg-champagne-100 text-stone-600"}`}
            >
              {MOMENTS[m]}
            </button>
          ))}
        </div>
        <p className="py-12 text-center text-stone-500">
          Aucune vidéo pour {momentFilter === "all" ? "cette sélection" : MOMENTS[momentFilter]}.
        </p>
      </div>
    );
  }

  const goNext = () => {
    setCurrentIndex((i) => (i < filteredPlaylist.length - 1 ? i + 1 : 0));
  };
  const goPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : filteredPlaylist.length - 1));
  };

  const byMoment = (momentFilter === "all" ? playlist : filteredPlaylist).reduce(
    (acc, item) => {
      const m = item.moment as MomentKey;
      if (!acc[m]) acc[m] = [];
      acc[m].push(item);
      return acc;
    },
    {} as Record<MomentKey, PlaylistItem[]>
  );
  const momentsToShow = momentFilter === "all" ? (Object.keys(MOMENTS) as MomentKey[]) : [momentFilter];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-champagne-200 bg-champagne-50/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-stone-700 hover:bg-champagne-100/80 transition touch-manipulation min-h-[44px]"
          aria-expanded={filtersOpen}
        >
          <span>Filtrer : {filterLabel}</span>
          <svg
            className={`w-5 h-5 text-stone-500 transition-transform shrink-0 ${filtersOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-3 pt-0 border-t border-champagne-200">
                <button
                  type="button"
                  onClick={() => setMomentFilter("all")}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition touch-manipulation min-h-[44px] ${
                    momentFilter === "all" ? "bg-primary-500 text-white" : "bg-champagne-100 text-stone-600 hover:bg-champagne-200"
                  }`}
                >
                  Tous
                </button>
                {(Object.keys(MOMENTS) as MomentKey[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMomentFilter(m)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition touch-manipulation min-h-[44px] ${
                      momentFilter === m ? "bg-primary-500 text-white" : "bg-champagne-100 text-stone-600 hover:bg-champagne-200"
                    }`}
                  >
                    {MOMENTS[m]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
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
            <p className="text-primary-500 text-sm mt-1">
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
          {momentsToShow.map((moment) => {
            const items = byMoment[moment] || [];
            if (!items.length) return null;

            return (
              <div key={moment}>
                <p className="text-primary-500 text-sm font-medium mb-2">
                  {MOMENTS[moment]}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() =>
                          setCurrentIndex(filteredPlaylist.findIndex((p) => p.id === item.id))
                        }
                        className={`w-full text-left py-3 px-3 rounded-lg transition text-sm touch-manipulation min-h-[44px] flex items-center ${
                          current?.id === item.id
                            ? "bg-primary-100 text-primary-700"
                            : "hover:bg-champagne-100 active:bg-champagne-200 text-stone-600"
                        }`}
                      >
                        <span className="truncate block">{item.title}</span>
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
    </div>
  );
}
