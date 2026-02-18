"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  names?: string;
}

const navLinks: { href: string; label: string; dashboard?: boolean }[] = [
  { href: "/#galerie", label: "Galerie" },
  { href: "/#lieu", label: "Lieu" },
  { href: "/#timeline", label: "Notre histoire" },
  { href: "/#playlist", label: "Playlist" },
  { href: "/#livre-or", label: "Livre d'or" },
  { href: "/dashboard", label: "Tableau de bord", dashboard: true },
];

export function Header({ names = "Notre Mariage" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-30 bg-champagne-50/95 backdrop-blur-md border-b border-champagne-200 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
    >
      <nav className="max-w-6xl mx-auto px-3 py-2.5 sm:px-4 md:py-4 flex items-center justify-between gap-2 min-h-[44px] md:min-h-0">
        <Link href="/" className="font-serif text-base sm:text-lg md:text-xl text-stone-800 hover:text-rose-500 active:text-rose-600 transition truncate min-w-0 max-w-[60vw] sm:max-w-none py-2 touch-manipulation">
          {names}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${link.dashboard ? "text-rose-500 hover:text-rose-600 font-medium" : "text-stone-600 hover:text-rose-500"}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-lg text-stone-600 hover:bg-champagne-200 active:bg-champagne-300 transition touch-manipulation shrink-0"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-champagne-200 bg-champagne-50 shadow-lg pb-[env(safe-area-inset-bottom)]"
          >
            <nav className="px-3 sm:px-4 py-3 space-y-1" aria-label="Menu principal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3.5 px-4 rounded-xl transition min-h-[48px] flex items-center text-base touch-manipulation ${link.dashboard ? "text-rose-500 font-medium hover:bg-rose-50 active:bg-rose-100" : "text-stone-600 hover:bg-champagne-200 hover:text-rose-500 active:bg-champagne-300"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
