"use client";

import { useState, useEffect } from "react";
import {
  getPlaylist,
  addPlaylistItem,
  updatePlaylistItem,
  deletePlaylistItem,
} from "@/lib/firestore";
import { MOMENTS } from "@/lib/cloudinary";
import type { PlaylistItem } from "@/lib/types";
import type { MomentKey } from "@/lib/cloudinary";

/** Récupère le titre réel d'une vidéo YouTube */
async function fetchYouTubeTitle(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/youtube-title?videoId=${encodeURIComponent(videoId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.title === "string" ? data.title : null;
  } catch {
    return null;
  }
}

/** Extrait l'ID vidéo YouTube depuis une URL ou un ID brut */
function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Déjà un ID (11 caractères alphanumériques + _-)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    // youtu.be/ID
    const shortMatch = trimmed.match(/(?:youtu\.be\/)([\w-]{11})/);
    if (shortMatch) return shortMatch[1];
    // youtube.com/embed/ID ou watch?v=ID ou shorts/ID
    const url = new URL(trimmed);
    if (url.hostname.replace("www.", "") === "youtube.com") {
      const path = url.pathname;
      const embedMatch = path.match(/\/embed\/([\w-]{11})/);
      if (embedMatch) return embedMatch[1];
      const shortsMatch = path.match(/\/shorts\/([\w-]{11})/);
      if (shortsMatch) return shortsMatch[1];
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
    }
  } catch {
    // pas une URL valide
  }
  return null;
}

export default function DashboardPlaylistPage() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [title, setTitle] = useState("");
  const [moment, setMoment] = useState<MomentKey>("soiree");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);
  const [refreshingTitles, setRefreshingTitles] = useState(false);
  const [fetchingTitle, setFetchingTitle] = useState(false);

  const load = async () => {
    setLoading(true);
    const list = await getPlaylist();
    setPlaylist(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const fetchYouTubeTitle = async (videoId: string): Promise<string | null> => {
    const res = await fetch(`/api/youtube-title?videoId=${encodeURIComponent(videoId)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data?.title ?? null;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(false);
    const videoId = extractYouTubeVideoId(youtubeInput);
    if (!videoId) {
      setAddError("Lien YouTube invalide. Collez une URL (ex. youtube.com/watch?v=...) ou l'ID de la vidéo.");
      return;
    }

    setAdding(true);
    let itemTitle = title.trim().slice(0, 100);
    if (!itemTitle) {
      const fetchedTitle = await fetchYouTubeTitle(videoId);
      itemTitle = fetchedTitle || `Vidéo ${videoId}`;
    }
    const id = await addPlaylistItem({
      title: itemTitle,
      youtubeVideoId: videoId,
      moment,
      order: playlist.length,
    });

    if (id) {
      setPlaylist((prev) => [
        ...prev,
        { id, title: itemTitle, youtubeVideoId: videoId, moment, order: prev.length },
      ]);
      setYoutubeInput("");
      setTitle("");
      setAddSuccess(true);
    } else {
      setAddError("Impossible d'ajouter la vidéo (vérifiez Firestore).");
    }
    setAdding(false);
  };

  const handleDelete = async (item: PlaylistItem) => {
    if (!confirm(`Retirer « ${item.title} » de la playlist ?`)) return;
    setActioning(item.id);
    try {
      await deletePlaylistItem(item.id);
      setPlaylist((prev) => prev.filter((p) => p.id !== item.id));
    } finally {
      setActioning(null);
    }
  };

  const handleMove = async (item: PlaylistItem, direction: "up" | "down") => {
    const idx = playlist.findIndex((p) => p.id === item.id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= playlist.length) return;

    setActioning(item.id);
    const reordered = [...playlist];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, removed);
    const updated = reordered.map((p, i) => ({ ...p, order: i }));
    try {
      await Promise.all(
        updated.map((p) => updatePlaylistItem(p.id, { order: p.order }))
      );
      setPlaylist(updated);
    } finally {
      setActioning(null);
    }
  };

  const handleRefreshTitles = async () => {
    if (!playlist.length) return;
    setRefreshingTitles(true);
    try {
      for (const item of playlist) {
        const fetchedTitle = await fetchYouTubeTitle(item.youtubeVideoId);
        if (fetchedTitle && fetchedTitle !== item.title) {
          await updatePlaylistItem(item.id, { title: fetchedTitle });
          setPlaylist((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, title: fetchedTitle } : p
            )
          );
        }
      }
    } finally {
      setRefreshingTitles(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-8">
        Playlist YouTube
      </h1>

      {/* Ajouter une vidéo */}
      <section className="mb-10 rounded-2xl border border-champagne-200 bg-champagne-50/60 p-4 sm:p-6">
        <h2 className="font-serif text-lg sm:text-xl text-stone-800 mb-3">
          Ajouter une vidéo
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Lien YouTube
            </label>
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
              className="w-full px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm placeholder:text-stone-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Titre
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="Saisissez un titre ou récupérez-le depuis YouTube"
                maxLength={100}
                className="flex-1 px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm"
              />
              <button
                type="button"
                onClick={async () => {
                  const videoId = extractYouTubeVideoId(youtubeInput);
                  if (!videoId) {
                    setAddError("Collez d’abord un lien YouTube ci-dessus.");
                    return;
                  }
                  setFetchingTitle(true);
                  setAddError(null);
                  const t = await fetchYouTubeTitle(videoId);
                  if (t) setTitle(t);
                  else setAddError("Impossible de récupérer le titre.");
                  setFetchingTitle(false);
                }}
                disabled={fetchingTitle || !youtubeInput.trim()}
                className="px-3 py-2.5 rounded-lg border border-champagne-300 bg-white text-stone-600 hover:bg-champagne-50 text-sm whitespace-nowrap disabled:opacity-50"
              >
                {fetchingTitle ? "…" : "Récupérer"}
              </button>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Optionnel : laissez vide pour utiliser le titre YouTube à l’ajout.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="playlist-moment" className="block text-sm font-medium text-stone-700 mb-1">
                Moment
              </label>
              <select
                id="playlist-moment"
                value={moment}
                onChange={(e) => setMoment(e.target.value as MomentKey)}
                className="w-full px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm"
              >
                {(Object.keys(MOMENTS) as MomentKey[]).map((m) => (
                  <option key={m} value={m}>
                    {MOMENTS[m]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          {addSuccess && <p className="text-sm text-green-600">Vidéo ajoutée à la playlist.</p>}
          <button
            type="submit"
            disabled={adding || !youtubeInput.trim()}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-rose-400 text-white text-sm font-medium hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Ajout..." : "Ajouter à la playlist"}
          </button>
        </form>
      </section>

      {/* Liste de la playlist */}
      <section className="rounded-2xl border border-champagne-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-lg sm:text-xl text-stone-800">
            Titres de la playlist
          </h2>
          {playlist.length > 0 && (
            <button
              type="button"
              onClick={handleRefreshTitles}
              disabled={refreshingTitles}
              className="text-sm px-3 py-2 rounded-lg border border-champagne-300 bg-white text-stone-600 hover:bg-champagne-50 disabled:opacity-50"
            >
              {refreshingTitles ? "Mise à jour…" : "Récupérer les titres YouTube"}
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-stone-500 text-sm">Chargement...</p>
        ) : playlist.length === 0 ? (
          <p className="text-stone-500 text-sm italic">Aucune vidéo. Ajoutez des liens YouTube ci-dessus.</p>
        ) : (
          <ul className="space-y-2">
            {playlist.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center gap-3 py-3 px-3 rounded-lg bg-champagne-50/80 border border-champagne-200"
              >
                <span className="text-stone-400 text-sm w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 truncate">{item.title}</p>
                  <p className="text-rose-500 text-xs mt-0.5">{MOMENTS[item.moment as MomentKey]}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(item, "up")}
                    disabled={index === 0 || actioning === item.id}
                    className="p-2 rounded-lg border border-champagne-300 text-stone-600 hover:bg-champagne-100 disabled:opacity-40"
                    aria-label="Monter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(item, "down")}
                    disabled={index === playlist.length - 1 || actioning === item.id}
                    className="p-2 rounded-lg border border-champagne-300 text-stone-600 hover:bg-champagne-100 disabled:opacity-40"
                    aria-label="Descendre"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={actioning === item.id}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    aria-label="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
