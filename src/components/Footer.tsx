"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-champagne-200 bg-champagne-50/80 py-6 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <p>Berges & Brest</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="text-primary-600 hover:text-primary-700 font-medium transition touch-manipulation"
            >
              Contactez-nous
            </button>
            <p>
              Développé par{" "}
              <span className="font-medium text-stone-600">la boîte Trevixia</span>
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setContactOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
          >
            <div
              className="absolute inset-0 bg-black/50"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md bg-champagne-50 rounded-2xl shadow-xl border border-champagne-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="contact-title" className="font-serif text-xl text-stone-800">
                  Contactez-nous
                </h3>
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  className="w-10 h-10 rounded-full bg-champagne-200 hover:bg-champagne-300 flex items-center justify-center text-stone-600 transition touch-manipulation"
                  aria-label="Fermer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <a
                  href="mailto:trevixiacontact@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-champagne-200 hover:border-primary-300 hover:bg-primary-50/50 transition"
                >
                  <span className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div className="text-left min-w-0">
                    <p className="text-xs text-stone-500">Par email</p>
                    <p className="text-stone-800 font-medium truncate">trevixiacontact@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/33763217791"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-champagne-200 hover:border-primary-300 hover:bg-primary-50/50 transition"
                >
                  <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <div className="text-left min-w-0">
                    <p className="text-xs text-stone-500">Par WhatsApp</p>
                    <p className="text-stone-800 font-medium">+33 7 63 21 77 91</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
