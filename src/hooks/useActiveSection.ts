"use client";

import { useState, useEffect } from "react";

const SECTION_IDS = ["galerie", "dress-code", "lieu", "timeline", "playlist", "livre-or"];

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const visibility: Record<string, number> = {};
    let rafId: number;

    const updateActive = () => {
      const entries = Object.entries(visibility).filter(([, v]) => v > 0);
      if (entries.length === 0) return;
      const best = entries.reduce((a, b) => (a[1] >= b[1] ? a : b));
      setActiveId(best[0]);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (SECTION_IDS.includes(id)) {
            visibility[id] = entry.intersectionRatio;
          }
        });
        rafId = requestAnimationFrame(updateActive);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.1, 0.5, 1] }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return activeId;
}
