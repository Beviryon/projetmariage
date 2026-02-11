"use client";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Media, Comment, PlaylistItem, GuestbookEntry } from "./types";

const COUPLE_ID = process.env.NEXT_PUBLIC_COUPLE_ID || "default";

// Constantes anti-spam
export const MAX_COMMENT_LENGTH = 500;
export const MIN_COMMENT_INTERVAL_MS = 60_000; // 1 minute entre 2 commentaires du même visiteur

function toDate(t: Timestamp | Date | undefined): Date {
  if (!t) return new Date();
  if (t instanceof Date) return t;
  return t.toDate();
}

export async function getMediaByMoment(moment: string): Promise<Media[]> {
  if (!db) return [];
  const q = query(
    collection(db, "media"),
    where("coupleId", "==", COUPLE_ID),
    where("moment", "==", moment),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as Media[];
}

export async function getAllMedia(): Promise<Media[]> {
  if (!db) return [];
  const q = query(
    collection(db, "media"),
    where("coupleId", "==", COUPLE_ID),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as Media[];
}

export async function hasLikedMedia(mediaId: string, visitorId: string): Promise<boolean> {
  if (!db) return false;
  const likeRef = doc(db, "media", mediaId, "likes", visitorId);
  const snap = await getDoc(likeRef);
  return snap.exists();
}

export async function toggleLike(mediaId: string, visitorId: string): Promise<boolean> {
  if (!db) return false;
  const likeRef = doc(db, "media", mediaId, "likes", visitorId);
  const mediaRef = doc(db, "media", mediaId);
  const mediaSnap = await getDoc(mediaRef);
  if (!mediaSnap.exists()) return false;

  const likeSnap = await getDoc(likeRef);
  const batch = writeBatch(db);
  const delta = likeSnap.exists() ? -1 : 1;
  batch.update(mediaRef, {
    likesCount: (mediaSnap.data()?.likesCount || 0) + delta,
  });
  if (likeSnap.exists()) {
    batch.delete(likeRef);
  } else {
    batch.set(likeRef, { visitorId, createdAt: serverTimestamp() });
  }
  await batch.commit();
  return !likeSnap.exists();
}

export async function getComments(mediaId: string): Promise<Comment[]> {
  if (!db) return [];
  const q = query(
    collection(db, "comments"),
    where("mediaId", "==", mediaId),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as Comment[];
}

export async function addComment(
  mediaId: string,
  visitorId: string,
  authorName: string,
  content: string
): Promise<string | null | "rate_limit"> {
  if (!db) return null;
  const trimmed = content.trim().slice(0, MAX_COMMENT_LENGTH);
  if (!trimmed) return null;

  // Limite anti-spam : 1 commentaire par minute par visiteur (si l'index Firestore existe)
  try {
    const recentQ = query(
      collection(db, "comments"),
      where("mediaId", "==", mediaId),
      where("visitorId", "==", visitorId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const recentSnap = await getDocs(recentQ);
    if (!recentSnap.empty) {
      const lastCreated = toDate(recentSnap.docs[0].data().createdAt);
      if (Date.now() - lastCreated.getTime() < MIN_COMMENT_INTERVAL_MS) {
        return "rate_limit";
      }
    }
  } catch {
    // Index manquant ou autre erreur : on laisse ajouter le commentaire
  }

  const ref = await addDoc(collection(db, "comments"), {
    mediaId,
    visitorId,
    authorName: authorName.trim().slice(0, 50),
    content: trimmed,
    createdAt: serverTimestamp(),
    isApproved: true,
  });
  return ref.id;
}

export async function getPlaylist(): Promise<PlaylistItem[]> {
  if (!db) return [];
  const q = query(
    collection(db, "playlist"),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as PlaylistItem[];
}

export async function addPlaylistItem(
  data: Omit<PlaylistItem, "id">
): Promise<string | null> {
  if (!db) return null;
  const existing = await getPlaylist();
  const nextOrder = existing.length === 0 ? 0 : Math.max(...existing.map((p) => p.order)) + 1;
  const ref = await addDoc(collection(db, "playlist"), {
    title: data.title.trim().slice(0, 100),
    youtubeVideoId: data.youtubeVideoId,
    moment: data.moment,
    order: data.order ?? nextOrder,
  });
  return ref.id;
}

export async function updatePlaylistItem(
  id: string,
  updates: Partial<Pick<PlaylistItem, "title" | "moment" | "order">>
): Promise<boolean> {
  if (!db) return false;
  const ref = doc(db, "playlist", id);
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title.trim().slice(0, 100);
  if (updates.moment !== undefined) payload.moment = updates.moment;
  if (updates.order !== undefined) payload.order = updates.order;
  if (Object.keys(payload).length === 0) return true;
  await updateDoc(ref, payload);
  return true;
}

export async function deletePlaylistItem(id: string): Promise<boolean> {
  if (!db) return false;
  await deleteDoc(doc(db, "playlist", id));
  return true;
}

export async function addMediaToFirestore(data: Omit<Media, "id" | "createdAt">): Promise<string | null> {
  if (!db) return null;
  const ref = await addDoc(collection(db, "media"), {
    ...data,
    createdAt: serverTimestamp(),
    likesCount: data.likesCount ?? 0,
  });
  return ref.id;
}

// ——— Dashboard (mariés) ———

/** Tous les médias (approuvés + en attente) pour le dashboard */
export async function getAllMediaForAdmin(): Promise<Media[]> {
  if (!db) return [];
  const q = query(
    collection(db, "media"),
    where("coupleId", "==", COUPLE_ID),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as Media[];
}

/** Médias en attente de validation */
export async function getPendingMedia(): Promise<Media[]> {
  if (!db) return [];
  const q = query(
    collection(db, "media"),
    where("coupleId", "==", COUPLE_ID),
    where("isApproved", "==", false),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as Media[];
}

/** Approuver ou refuser un média */
export async function setMediaApproval(mediaId: string, isApproved: boolean): Promise<boolean> {
  if (!db) return false;
  const mediaRef = doc(db, "media", mediaId);
  await updateDoc(mediaRef, { isApproved });
  return true;
}

/** Supprimer un média (refus définitif) */
export async function deleteMedia(mediaId: string): Promise<boolean> {
  if (!db) return false;
  const mediaRef = doc(db, "media", mediaId);
  await deleteDoc(mediaRef);
  return true;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  if (!db) return [];
  const q = query(
    collection(db, "guestbook"),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  })) as GuestbookEntry[];
}

export async function addGuestbookEntry(
  visitorId: string,
  authorName: string,
  content: string
): Promise<string | null> {
  if (!db) return null;
  const trimmed = content.trim().slice(0, 1000);
  if (!trimmed) return null;

  const ref = await addDoc(collection(db, "guestbook"), {
    visitorId,
    authorName: authorName.trim().slice(0, 50),
    content: trimmed,
    createdAt: serverTimestamp(),
    isApproved: true,
  });
  return ref.id;
}
