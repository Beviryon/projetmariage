const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export type MediaType = "image" | "video";

export const MOMENTS = {
  preparatifs: "Préparatifs",
  ceremonie: "Cérémonie",
  soiree: "Soirée",
} as const;

export type MomentKey = keyof typeof MOMENTS;

/**
 * Génère une URL Cloudinary optimisée (f_auto, q_auto)
 */
export function getCloudinaryUrl(
  cloudinaryId: string,
  type: MediaType,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    fetchFormat?: string;
    rawTransform?: string;
  } = {}
): string {
  if (!CLOUD_NAME) return "";
  const { width, height, crop = "fill", rawTransform } = options;
  const resourceType = type === "video" ? "video" : "image";
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload`;

  if (rawTransform) {
    return `${baseUrl}/${rawTransform}/${cloudinaryId}`;
  }

  const transforms: string[] = ["f_auto", "q_auto"];
  if (type === "image") {
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`c_${crop}`);
  }
  // Pour vidéo : format minimal pour lecture
  const transformStr = transforms.join(",");
  return `${baseUrl}/${transformStr}/${cloudinaryId}`;
}

/**
 * URL pour affichage thumbnail
 */
export function getThumbnailUrl(cloudinaryId: string, type: MediaType): string {
  return getCloudinaryUrl(cloudinaryId, type, {
    width: 400,
    height: 400,
    crop: "fill",
  });
}

/**
 * URL pour affichage fullscreen
 */
export function getFullscreenUrl(cloudinaryId: string, type: MediaType): string {
  return getCloudinaryUrl(cloudinaryId, type, {
    rawTransform: type === "image" ? "f_auto,q_auto:best,w_1920" : "f_auto,q_auto",
  });
}

/**
 * URL pour fond hero (grand format, recadrage fill)
 */
export function getHeroBackgroundUrl(cloudinaryId: string): string {
  return getCloudinaryUrl(cloudinaryId, "image", {
    rawTransform: "f_auto,q_auto:good,w_1920,h_1080,c_fill",
  });
}
