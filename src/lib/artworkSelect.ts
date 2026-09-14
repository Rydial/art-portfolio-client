import type {ArtworkData} from "@/types/artwork";

import {byNewestFirst} from "./artworkSort";

interface SelectOptions {
  limit?: number;
}

interface SelectFeaturedOptions extends SelectOptions {
  fill?: boolean;
}

/**
 * Selects featured artworks, most recently added first. If `fill` is true, tops
 * up any remaining slots with the most recently added non-featured artworks,
 * appended after the featured ones.
 *
 * @param artworks The full pool of artworks to select from.
 * @param options.limit Caps the number of artworks returned. If omitted, all
 *                      matching artworks are returned. If 0 or negative,
 *                      returns an empty array.
 * @param options.fill Tops up with non-featured artworks if true. Default
 *                     `false`.
 * @returns Featured artworks first, then (if `fill`) non-featured artworks,
 *          both ordered newest-first, capped at `limit`.
 */
export function selectFeatured(
  artworks: ArtworkData[],
  {limit, fill = false}: SelectFeaturedOptions = {}
): ArtworkData[] {
  if (limit !== undefined && limit <= 0) return [];

  // Extract featured artworks
  const featured = artworks.filter((a) => a.featured).sort(byNewestFirst);

  // Featured pool already meets the limit — no need to fill
  if (limit !== undefined && featured.length >= limit) {
    return featured.slice(0, limit);
  }

  // No fill requested — return featured only, capped at limit if provided
  if (!fill) {
    return limit === undefined ? featured : featured.slice(0, limit);
  }

  // Featured pool is thin (or no limit) — top up with non-featured pieces
  const featuredIds = new Set(featured.map((a) => a.id));
  const remaining = artworks
    .filter((a) => !featuredIds.has(a.id))
    .sort(byNewestFirst);
  const fallback =
    limit === undefined
      ? remaining
      : remaining.slice(0, limit - featured.length);

  return [...featured, ...fallback];
}
