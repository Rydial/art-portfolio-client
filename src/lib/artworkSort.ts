import type {ArtworkData} from "@/types/artwork";

/**
 * Comparator for sorting artworks by recency — most recently added first.
 *
 * @param a The first artwork to compare.
 * @param b The second artwork to compare.
 * @returns Negative if `a` is more recent than `b`, positive if `b` is more
 *          recent than `a`, or `0` if added on the same day.
 */
export function byNewestFirst(a: ArtworkData, b: ArtworkData) {
  return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
}
