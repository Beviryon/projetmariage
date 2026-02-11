"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getCloudinaryUrl, getThumbnailUrl, getFullscreenUrl, MOMENTS } from "@/lib/cloudinary";
import { getAllMedia } from "@/lib/firestore";
import { useVisitorId } from "@/hooks/useVisitorId";
import { hasLikedMedia } from "@/lib/firestore";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import type { Media } from "@/lib/types";
import type { MomentKey } from "@/lib/cloudinary";

const MOMENT_ORDER: MomentKey[] = ["preparatifs", "ceremonie", "soiree"];
const ITEMS_PER_PAGE = 8;

export function MediaGallery() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState<Media | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [momentFilter, setMomentFilter] = useState<MomentKey | "all">("all");

  const visitorId = useVisitorId();

  useEffect(() => {
    getAllMedia().then((list) => {
      setMedia(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!visitorId) return;
    const check = async () => {
      const map: Record<string, boolean> = {};
      for (const m of media) {
        map[m.id] = await hasLikedMedia(m.id, visitorId);
      }
      setLikedMap(map);
    };
    check();
  }, [media, visitorId]);

  const byMoment = MOMENT_ORDER.reduce((acc, moment) => {
    acc[moment] = media.filter((m) => m.moment === moment);
    return acc;
  }, {} as Record<MomentKey, Media[]>);

  const orderedMedia = MOMENT_ORDER.flatMap((moment) => byMoment[moment] ?? []);
  const filteredMedia =
    momentFilter === "all"
      ? orderedMedia
      : orderedMedia.filter((m) => m.moment === momentFilter);
  const totalPages = Math.max(1, Math.ceil(filteredMedia.length / ITEMS_PER_PAGE));
  const pageIndex = Math.min(currentPage, totalPages);
  const start = (pageIndex - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredMedia.slice(start, start + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse text-stone-400">Chargement de la galerie...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setMomentFilter("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition touch-manipulation ${
              momentFilter === "all"
                ? "bg-rose-400 text-white"
                : "bg-champagne-100 text-stone-600 hover:bg-champagne-200"
            }`}
          >
            Tous
          </button>
          {(Object.keys(MOMENTS) as MomentKey[]).map((moment) => (
            <button
              key={moment}
              type="button"
              onClick={() => {
                setMomentFilter(moment);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition touch-manipulation ${
                momentFilter === moment
                  ? "bg-rose-400 text-white"
                  : "bg-champagne-100 text-stone-600 hover:bg-champagne-200"
              }`}
            >
              {MOMENTS[moment]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col gap-1.5 sm:gap-2"
            >
              <div
                className="group relative aspect-square rounded-xl overflow-hidden bg-stone-200 cursor-pointer"
                onClick={() => setFullscreen(item)}
              >
                {item.type === "image" ? (
                  <Image
                    src={getThumbnailUrl(item.cloudinaryId, "image")}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={getCloudinaryUrl(item.cloudinaryId, "video")}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition flex items-end justify-between p-2 sm:p-3">
                  <LikeButton
                    mediaId={item.id}
                    visitorId={visitorId}
                    initialLiked={likedMap[item.id] ?? false}
                    initialCount={item.likesCount}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(showComments === item.id ? null : item.id);
                    }}
                    className="text-white text-xs sm:text-sm flex items-center gap-1 min-w-[44px] min-h-[44px] justify-center md:min-w-0 md:min-h-0"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="hidden sm:inline">Commenter</span>
                  </button>
                </div>
              </div>
              <div className="px-0.5">
                <p className="text-stone-600 font-medium text-xs sm:text-sm">
                  {MOMENTS[item.moment]}
                </p>
                {item.caption?.trim() && item.caption.trim() !== MOMENTS[item.moment] && (
                  <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">
                    {item.caption.trim()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:pt-6"
            aria-label="Pagination galerie"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pageIndex <= 1}
              className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg border border-champagne-300 bg-white text-stone-700 hover:bg-champagne-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg font-medium touch-manipulation ${
                    p === pageIndex
                      ? "bg-rose-400 text-white border border-rose-500"
                      : "border border-champagne-300 bg-white text-stone-700 hover:bg-champagne-50"
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === pageIndex ? "page" : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageIndex >= totalPages}
              className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg border border-champagne-300 bg-white text-stone-700 hover:bg-champagne-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </nav>
        )}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <FullscreenViewer
            media={fullscreen}
            allMedia={media}
            onClose={() => setFullscreen(null)}
            visitorId={visitorId}
            likedMap={likedMap}
          />
        )}
      </AnimatePresence>

      {/* Comment modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
            onClick={() => setShowComments(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[min(85dvh,calc(100vh-2rem))] overflow-y-auto mx-2 my-4"
            >
              <CommentSection mediaId={showComments} />
              <button
                onClick={() => setShowComments(null)}
                className="mt-4 w-full py-3 rounded-lg border border-stone-300 text-stone-600 min-h-[44px] touch-manipulation"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FullscreenViewer({
  media,
  allMedia,
  onClose,
  visitorId,
  likedMap,
}: {
  media: Media;
  allMedia: Media[];
  onClose: () => void;
  visitorId: string;
  likedMap: Record<string, boolean>;
}) {
  const idx = allMedia.findIndex((m) => m.id === media.id);
  const [current, setCurrent] = useState(media);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  // Sync current when media prop changes (e.g. when opening)
  useEffect(() => {
    setCurrent(media);
  }, [media.id]);

  const goNext = () => {
    if (idx < allMedia.length - 1) setCurrent(allMedia[idx + 1]);
  };
  const goPrev = () => {
    if (idx > 0) setCurrent(allMedia[idx - 1]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStart === null) return;
    const diff = swipeStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    setSwipeStart(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="gallery-overlay flex flex-col"
    >
      <button
        onClick={onClose}
        className="absolute z-10 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:bg-white/40 touch-manipulation top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))]"
        aria-label="Fermer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {current.type === "image" ? (
          <Image
            src={getFullscreenUrl(current.cloudinaryId, "image")}
            alt=""
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain"
            unoptimized
          />
        ) : (
          <video
            src={getCloudinaryUrl(current.cloudinaryId, "video")}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full"
          />
        )}
      </div>

      <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="text-center text-white text-sm sm:text-base">
          <p className="font-medium">{MOMENTS[current.moment]}</p>
          {current.caption?.trim() && current.caption.trim() !== MOMENTS[current.moment] && (
            <p className="text-white/90 mt-0.5 text-xs sm:text-sm max-w-xl mx-auto">{current.caption.trim()}</p>
          )}
        </div>
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={goPrev}
            disabled={idx <= 0}
            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center disabled:opacity-30 hover:bg-white/30 active:bg-white/40 touch-manipulation shrink-0"
            aria-label="Précédent"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <LikeButton
            mediaId={current.id}
            visitorId={visitorId}
            initialLiked={likedMap[current.id] ?? false}
            initialCount={current.likesCount}
          />
          <button
            onClick={goNext}
            disabled={idx >= allMedia.length - 1}
            className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center disabled:opacity-30 hover:bg-white/30 active:bg-white/40 touch-manipulation shrink-0"
            aria-label="Suivant"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
