"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-champagne-50">
      <header className="sticky top-0 z-20 border-b border-champagne-200 bg-champagne-50/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-serif text-xl text-stone-800 hover:text-rose-500 transition"
            >
              Tableau de bord
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/dashboard/media"
                className={`transition ${
                  pathname === "/dashboard/media"
                    ? "text-rose-500 font-medium"
                    : "text-stone-600 hover:text-rose-500"
                }`}
              >
                Médias
              </Link>
              <Link
                href="/dashboard/playlist"
                className={`transition ${
                  pathname === "/dashboard/playlist"
                    ? "text-rose-500 font-medium"
                    : "text-stone-600 hover:text-rose-500"
                }`}
              >
                Playlist
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            ← Voir le site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
