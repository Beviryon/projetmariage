"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toggleLike } from "@/lib/firestore";

interface LikeButtonProps {
  mediaId: string;
  visitorId: string;
  initialLiked: boolean;
  initialCount: number;
  onUpdate?: (liked: boolean, count: number) => void;
}

export function LikeButton({
  mediaId,
  visitorId,
  initialLiked,
  initialCount,
  onUpdate,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    if (!visitorId) return;
    setAnimating(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((c) => c + (newLiked ? 1 : -1));

    try {
      await toggleLike(mediaId, visitorId);
      onUpdate?.(newLiked, count + (newLiked ? 1 : -1));
    } catch {
      setLiked(liked);
      setCount(count);
    } finally {
      setAnimating(false);
    }
  };

  const hasLikes = count > 0 || liked;
  const likeColorClass = hasLikes
    ? "text-red-500 hover:text-red-600"
    : "text-white/90 hover:text-white";

  return (
    <button
      onClick={handleClick}
      disabled={animating}
      className={`flex items-center gap-2 transition disabled:opacity-70 min-w-[44px] min-h-[44px] justify-center touch-manipulation rounded-lg px-2 py-1.5 ${hasLikes ? "bg-white/25" : ""} ${likeColorClass}`}
    >
      <motion.span
        animate={animating && liked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={liked ? 0 : 1.5}
          className="w-7 h-7 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </motion.span>
      <span className={`text-base font-semibold tabular-nums ${hasLikes ? "text-red-500" : ""}`}>
        {count}
      </span>
    </button>
  );
}
