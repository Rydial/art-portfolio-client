import type {Artwork} from "@/types/artwork";

export interface FeaturedSelectionOptions {
  limit?: number; // Max number of slides
}

export function selectFeaturedArtworks(
  artworks: Artwork[],
  {limit = 5}: FeaturedSelectionOptions = {}
): Artwork[] {
  const byRecency = (a: Artwork, b: Artwork) =>
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();

  // Extract featured artworks
  const featured = artworks.filter((a) => a.featured).sort(byRecency);

  // Featured pool already meets the limit — no need to fill
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  // Featured pool is thin — top up with the most recent non-featured pieces
  const featuredIds = new Set(featured.map((a) => a.id));
  const fallback = artworks
    .filter((a) => !featuredIds.has(a.id))
    .sort(byRecency)
    .slice(0, limit - featured.length);

  return [...featured, ...fallback];
}
