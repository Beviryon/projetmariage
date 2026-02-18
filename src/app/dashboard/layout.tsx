"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/dashboard/media", label: "Médias" },
    { href: "/dashboard/playlist", label: "Playlist" },
  ] as const;

  return (
    <div className="min-h-screen bg-champagne-50">
      <header className="sticky top-0 z-20 border-b border-champagne-200 bg-champagne-50/95 backdrop-blur pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          {/* Desktop: titre + nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-serif text-xl text-stone-800 hover:text-primary-500 transition"
            >
              Tableau de bord
            </Link>
            <nav className="flex gap-4 text-sm" aria-label="Navigation dashboard">
              <Link
                href="/dashboard/media"
                className={`transition py-2 ${
                  pathname === "/dashboard/media"
                    ? "text-primary-500 font-medium"
                    : "text-stone-600 hover:text-primary-500"
                }`}
              >
                Médias
              </Link>
              <Link
                href="/dashboard/playlist"
                className={`transition py-2 ${
                  pathname === "/dashboard/playlist"
                    ? "text-primary-500 font-medium"
                    : "text-stone-600 hover:text-primary-500"
                }`}
              >
                Playlist
              </Link>
            </nav>
          </div>

          {/* Mobile: titre + menu burger */}
          <div className="flex md:hidden items-center justify-between w-full min-w-0">
            <Link
              href="/dashboard"
              className="font-serif text-lg text-stone-800 hover:text-primary-500 transition truncate min-w-0"
            >
              Tableau de bord
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center px-3 text-sm text-stone-500 hover:text-stone-700 rounded-lg touch-manipulation"
              >
                ← Site
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-stone-600 hover:bg-champagne-200 active:bg-champagne-300 transition touch-manipulation"
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
            </div>
          </div>

          {/* Desktop: lien voir le site */}
          <Link
            href="/"
            className="hidden md:inline text-sm text-stone-500 hover:text-stone-700 py-2"
          >
            ← Voir le site
          </Link>
        </div>

        {/* Mobile dropdown dashboard */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-champagne-200 bg-champagne-50/98 shadow-lg pb-[env(safe-area-inset-bottom)]"
            >
              <nav className="px-3 py-3 space-y-1" aria-label="Menu dashboard">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3.5 px-4 rounded-xl transition min-h-[48px] flex items-center text-base touch-manipulation ${
                      pathname === link.href
                        ? "text-primary-500 font-medium bg-primary-50"
                        : "text-stone-600 hover:bg-champagne-200 active:bg-champagne-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
