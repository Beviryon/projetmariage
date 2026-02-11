"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  getPendingMedia,
  getAllMediaForAdmin,
  setMediaApproval,
  deleteMedia,
  addMediaToFirestore,
} from "@/lib/firestore";
import { getThumbnailUrl, getCloudinaryUrl, MOMENTS } from "@/lib/cloudinary";
import type { Media } from "@/lib/types";
import type { MomentKey } from "@/lib/cloudinary";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const COUPLE_ID = process.env.NEXT_PUBLIC_COUPLE_ID || "default";

/** Extrait le public_id Cloudinary depuis une URL ou retourne l'input si c'est déjà un ID */
function extractCloudinaryPublicId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.includes("cloudinary.com")) {
    try {
      const url = new URL(trimmed);
      const path = url.pathname;
      const uploadIdx = path.indexOf("/upload/");
      if (uploadIdx === -1) return null;
      const afterUpload = path.slice(uploadIdx + 8);
      const parts = afterUpload.split("/").filter(Boolean);
      const withoutVersion = parts.filter((p) => !/^v\d+$/.test(p));
      if (withoutVersion.length === 0) return null;
      let publicId = withoutVersion.join("/");
      const lastDot = publicId.lastIndexOf(".");
      if (lastDot > 0) publicId = publicId.slice(0, lastDot);
      return publicId;
    } catch {
      return null;
    }
  }
  return trimmed;
}

export default function DashboardMediaPage() {
  const [pending, setPending] = useState<Media[]>([]);
  const [approved, setApproved] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [actioning, setActioning] = useState<string | null>(null);
  const [cloudinaryInput, setCloudinaryInput] = useState("");
  const [moment, setMoment] = useState<MomentKey>("soiree");
  const [mediaType, setMediaType] = useState<Media["type"]>("image");
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    const [pendingList, allList] = await Promise.all([
      getPendingMedia(),
      getAllMediaForAdmin(),
    ]);
    setPending(pendingList);
    setApproved(allList.filter((m) => m.isApproved));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      await setMediaApproval(id, true);
      setPending((p) => p.filter((m) => m.id !== id));
      const media = pending.find((m) => m.id === id);
      if (media) setApproved((a) => [{ ...media, isApproved: true }, ...a]);
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Refuser ce média ? Il ne sera plus visible et pourra être supprimé.")) return;
    setActioning(id);
    try {
      await deleteMedia(id);
      setPending((p) => p.filter((m) => m.id !== id));
    } finally {
      setActioning(null);
    }
  };

  const handleUnapprove = async (id: string) => {
    if (!confirm("Retirer ce média de la galerie publique ?")) return;
    setActioning(id);
    try {
      await setMediaApproval(id, false);
      const media = approved.find((m) => m.id === id);
      setApproved((a) => a.filter((m) => m.id !== id));
      if (media) setPending((p) => [{ ...media, isApproved: false }, ...p]);
    } finally {
      setActioning(null);
    }
  };

  const handleAddByLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(false);
    const publicId = extractCloudinaryPublicId(cloudinaryInput);
    if (!publicId) {
      setAddError("Lien ou ID Cloudinary invalide. Collez une URL Cloudinary ou un public_id (ex. mariage/photo1).");
      return;
    }

    setAdding(true);
    const captionTrimmed = caption.trim().slice(0, 300) || undefined;
    const id = await addMediaToFirestore({
      coupleId: COUPLE_ID,
      type: mediaType,
      cloudinaryId: publicId,
      moment,
      likesCount: 0,
      uploadedBy: "dashboard",
      isApproved: true,
      ...(captionTrimmed && { caption: captionTrimmed }),
    } as Omit<Media, "id" | "createdAt">);

    if (id) {
      const newMedia: Media = {
        id,
        coupleId: COUPLE_ID,
        type: mediaType,
        cloudinaryId: publicId,
        moment,
        likesCount: 0,
        uploadedBy: "dashboard",
        isApproved: true,
        createdAt: new Date(),
        ...(captionTrimmed && { caption: captionTrimmed }),
      };
      setApproved((prev) => [newMedia, ...prev]);
      setCloudinaryInput("");
      setCaption("");
      setAddSuccess(true);
    } else {
      setAddError("Impossible d'ajouter le média (vérifiez Firestore).");
    }
    setAdding(false);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-6">
        Gestion des médias
      </h1>

      {/* Ajouter un média par lien Cloudinary */}
      <section className="mb-10 rounded-2xl border border-champagne-200 bg-champagne-50/60 p-4 sm:p-6">
        <h2 className="font-serif text-lg sm:text-xl text-stone-800 mb-3">
          Ajouter une photo ou une vidéo
        </h2>
        {!CLOUD_NAME ? (
          <p className="text-sm text-red-600">
            Cloudinary n'est pas configuré. Ajoutez{" "}
            <code className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> dans{" "}
            <code className="font-mono">.env.local</code>.
          </p>
        ) : (
          <form onSubmit={handleAddByLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Lien ou ID Cloudinary
              </label>
              <input
                type="text"
                value={cloudinaryInput}
                onChange={(e) => setCloudinaryInput(e.target.value)}
                placeholder="https://res.cloudinary.com/.../image/upload/.../photo.jpg ou mariage/ma-photo"
                className="w-full px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm placeholder:text-stone-400"
              />
              <p className="mt-1 text-xs text-stone-500">
                Collez l’URL complète d’une image/vidéo Cloudinary ou uniquement le public_id (ex. mariage/photo1).
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dashboard-media-type" className="block text-sm font-medium text-stone-700 mb-1">
                  Type
                </label>
                <select
                  id="dashboard-media-type"
                  aria-label="Type de média"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as Media["type"])}
                  className="w-full px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div>
                <label htmlFor="dashboard-moment" className="block text-sm font-medium text-stone-700 mb-1">
                  Moment / Événement
                </label>
                <select
                  id="dashboard-moment"
                  aria-label="Moment ou événement"
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
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Légende (optionnel)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 300))}
                placeholder="Ex : Coupe de champagne avec les mariés"
                maxLength={300}
                className="w-full px-3 py-2.5 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-rose-300 text-sm"
              />
              <p className="mt-1 text-xs text-stone-500">{caption.length}/300</p>
            </div>
            {addError && (
              <p className="text-sm text-red-600">{addError}</p>
            )}
            {addSuccess && (
              <p className="text-sm text-green-600">Média ajouté à la galerie.</p>
            )}
            <button
              type="submit"
              disabled={adding || !cloudinaryInput.trim()}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-rose-400 text-white text-sm font-medium hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "Ajout..." : "Ajouter à la galerie"}
            </button>
          </form>
        )}
      </section>

      <div className="flex gap-2 mb-8 border-b border-champagne-200">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === "pending"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          En attente ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("approved")}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
            tab === "approved"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          Publiés ({approved.length})
        </button>
      </div>

      {loading ? (
        <p className="text-stone-500 py-12">Chargement...</p>
      ) : tab === "pending" ? (
        pending.length === 0 ? (
          <p className="text-stone-500 py-12">
            Aucun média en attente.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((m) => (
              <MediaCard
                key={m.id}
                media={m}
                onApprove={() => handleApprove(m.id)}
                onReject={() => handleReject(m.id)}
                loading={actioning === m.id}
                mode="pending"
              />
            ))}
          </div>
        )
      ) : (
        approved.length === 0 ? (
          <p className="text-stone-500 py-12">Aucun média publié.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map((m) => (
              <MediaCard
                key={m.id}
                media={m}
                onUnapprove={() => handleUnapprove(m.id)}
                loading={actioning === m.id}
                mode="approved"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function MediaCard({
  media,
  onApprove,
  onReject,
  onUnapprove,
  loading,
  mode,
}: {
  media: Media;
  onApprove?: () => void;
  onReject?: () => void;
  onUnapprove?: () => void;
  loading: boolean;
  mode: "pending" | "approved";
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-champagne-200"
    >
      <div className="relative aspect-square bg-stone-100">
        {media.type === "image" ? (
          <Image
            src={getThumbnailUrl(media.cloudinaryId, "image")}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <video
            src={getCloudinaryUrl(media.cloudinaryId, "video")}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        )}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
          {MOMENTS[media.moment as MomentKey]}
        </span>
      </div>
      <div className="p-3">
        <p className="text-stone-400 text-xs">{formatDate(media.createdAt)}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {mode === "pending" && (
            <>
              <button
                type="button"
                onClick={onApprove}
                disabled={loading}
                className="flex-1 min-w-[80px] py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition"
              >
                {loading ? "..." : "Publier"}
              </button>
              <button
                type="button"
                onClick={onReject}
                disabled={loading}
                className="flex-1 min-w-[80px] py-2 rounded-lg bg-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-300 disabled:opacity-50 transition"
              >
                Refuser
              </button>
            </>
          )}
          {mode === "approved" && onUnapprove && (
            <button
              type="button"
              onClick={onUnapprove}
              disabled={loading}
              className="w-full py-2 rounded-lg border border-stone-300 text-stone-600 text-sm hover:bg-stone-50 disabled:opacity-50 transition"
            >
              {loading ? "..." : "Retirer de la galerie"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
