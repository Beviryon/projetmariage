import { NextRequest, NextResponse } from "next/server";

/**
 * Récupère le titre d'une vidéo YouTube via oEmbed (pas de clé API).
 * GET /api/youtube-title?videoId=XXX
 */
export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    return NextResponse.json(
      { error: "videoId invalide" },
      { status: 400 }
    );
  }

  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Vidéo introuvable ou indisponible" },
        { status: 404 }
      );
    }
    const data = (await res.json()) as { title?: string };
    const title = typeof data?.title === "string" ? data.title.trim().slice(0, 100) : null;
    if (!title) {
      return NextResponse.json(
        { error: "Titre non disponible" },
        { status: 404 }
      );
    }
    return NextResponse.json({ title });
  } catch {
    return NextResponse.json(
      { error: "Impossible de récupérer le titre" },
      { status: 502 }
    );
  }
}
