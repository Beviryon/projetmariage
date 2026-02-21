"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGE =
  "Pour des raisons de vie privée, les captures sont interdites. Veuillez vous rapprocher des mariés.";

export function CaptureGuard() {
  const [showPopup, setShowPopup] = useState(false);

  const handleBlock = useCallback((e: Event) => {
    e.preventDefault();
    setShowPopup(true);
  }, []);

  useEffect(() => {
    const opts = { capture: true };
    document.addEventListener("contextmenu", handleBlock, opts);
    document.addEventListener("copy", handleBlock, opts);
    document.addEventListener("cut", handleBlock, opts);

    const onBeforePrint = () => {
      setShowPopup(true);
    };
    window.addEventListener("beforeprint", onBeforePrint);

    return () => {
      document.removeEventListener("contextmenu", handleBlock, opts);
      document.removeEventListener("copy", handleBlock, opts);
      document.removeEventListener("cut", handleBlock, opts);
      window.removeEventListener("beforeprint", onBeforePrint);
    };
  }, [handleBlock]);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
          role="presentation"
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="capture-guard-title"
            aria-describedby="capture-guard-desc"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md p-5 sm:p-6 bg-champagne-50 rounded-2xl shadow-xl border border-champagne-200"
          >
            <div className="flex items-start gap-3">
              <span
                className="shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
                aria-hidden
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <h3
                  id="capture-guard-title"
                  className="font-serif text-lg sm:text-xl text-stone-800 mb-1"
                >
                  Captures interdites
                </h3>
                <p
                  id="capture-guard-desc"
                  className="text-stone-600 text-sm sm:text-base"
                >
                  {MESSAGE}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="mt-4 w-full py-3 sm:py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition font-medium touch-manipulation min-h-[44px]"
            >
              J&apos;ai compris
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
