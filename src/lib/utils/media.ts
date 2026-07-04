/**
 * Safely extracts a URL from a Payload CMS media object.
 * Handles both the populated object { url: string } and raw ID case.
 */
export function getMediaUrl(
  media: { url?: string; alt?: string } | number | null | undefined,
  fallback = ""
): string {
  if (media && typeof media === "object" && media.url) return media.url;
  return fallback;
}

/**
 * Safely extracts alt text from a Payload CMS media object.
 */
export function getMediaAlt(
  media: { alt?: string; url?: string } | number | null | undefined,
  fallback: string
): string {
  if (media && typeof media === "object" && media.alt) return media.alt;
  return fallback;
}
