"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  names?: string;
}

const navLinks: { href: string; label: string; dashboard?: boolean }[] = [
  { href: "/#galerie", label: "Galerie" },
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
      className="fixed top-0 left-0 right-0 z-30 bg-champagne-50/95 backdrop-blur-md border-b border-champagne-200"
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg md:text-xl text-stone-800 hover:text-rose-500 transition">
          {names}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
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
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-stone-600 hover:bg-champagne-200 transition"
          aria-label="Menu"
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
            className="md:hidden overflow-hidden border-t border-champagne-200 bg-champagne-50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-3 rounded-lg transition ${link.dashboard ? "text-rose-500 font-medium hover:bg-rose-50" : "text-stone-600 hover:bg-champagne-200 hover:text-rose-500"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
