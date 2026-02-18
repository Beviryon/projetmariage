"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function NameModal({ isOpen, onClose, onSave }: NameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSave(trimmed);
      setName("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100%-2rem)] max-w-md max-h-[min(90dvh,calc(100vh-2rem))] overflow-y-auto p-5 sm:p-6 mx-4 bg-champagne-50 rounded-2xl shadow-xl border border-champagne-200"
          >
            <h3 className="font-serif text-lg sm:text-xl text-stone-800 mb-2">
              Comment vous appelez-vous ?
            </h3>
            <p className="text-stone-600 text-sm mb-4">
              Entrez votre prénom pour pouvoir commenter.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre prénom"
                maxLength={50}
                className="w-full px-4 py-3 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none transition"
                autoFocus
              />
              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 sm:py-2.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 transition touch-manipulation min-h-[44px]"
                >
                  Plus tard
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-3 sm:py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium touch-manipulation min-h-[44px]"
                >
                  Continuer
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
