export type MomentKey = "banniere" | "compagnons" | "preparatifs" | "ceremonie" | "soiree";

export interface Couple {
  id: string;
  slug: string;
  names: string;
  dateMariage: string;
  coverImage: string;
  isPrivate: boolean;
}

export interface Media {
  id: string;
  coupleId: string;
  type: "image" | "video";
  cloudinaryId: string;
  moment: MomentKey;
  createdAt: Date;
  likesCount: number;
  uploadedBy?: string;
  isApproved: boolean;
  /** Légende ou description (optionnel) */
  caption?: string;
}

export interface Like {
  visitorId: string;
  mediaId: string;
}

export interface Comment {
  id: string;
  mediaId: string;
  visitorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isApproved: boolean;
}

export interface PlaylistItem {
  id: string;
  title: string;
  youtubeVideoId: string;
  moment: MomentKey;
  order: number;
}

export interface GuestbookEntry {
  id: string;
  visitorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isApproved: boolean;
}
