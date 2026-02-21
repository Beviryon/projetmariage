"use client";

const LIVE_STREAM_URL = process.env.NEXT_PUBLIC_LIVE_STREAM_URL?.trim() || "";

export function LiveStreamBanner() {
  if (!LIVE_STREAM_URL) return null;

  return (
    <section
      className="relative py-6 sm:py-8 px-3 sm:px-6 bg-primary-600 text-white"
      aria-labelledby="live-stream-title"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p id="live-stream-title" className="font-serif text-lg sm:text-xl font-light mb-2">
          Vous n&apos;êtes pas sur place ?
        </p>
        <p className="text-white/90 text-sm sm:text-base mb-4">
          Regardez la cérémonie en direct depuis chez vous.
        </p>
        <a
          href={LIVE_STREAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-primary-600 font-medium hover:bg-white/95 active:scale-[0.98] transition min-h-[48px] touch-manipulation"
        >
          <span className="inline-flex w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden />
          Regarder en direct
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}
