import type {ArtworkData} from "@/types/artwork";

import {byNewestFirst} from "./artworkSort";

interface SelectOptions {
  limit?: number;
}

interface SelectFeaturedOptions extends SelectOptions {
  fill?: boolean;
}

/**
 * Selects the most recently added artworks.
 *
 * @param artworks The full pool of artworks to select from.
 * @param options.limit Caps the number of artworks returned. If omitted, all
 *                      matching artworks are returned. If 0 or negative,
 *                      returns an empty array.
 * @returns The `limit` most recently added artworks, most recent first.
 */
export function selectRecent(
  artworks: ArtworkData[],
  {limit}: SelectOptions = {}
): ArtworkData[] {
  if (limit !== undefined && limit <= 0) return [];

  return [...artworks].sort(byNewestFirst).slice(0, limit);
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

/**
 * Selects the artwork matching `artworkId`, plus its nearest neighbors by
 * recency — alternating newer and older — until `limit` is reached. Falls back
 * to the most recently added artworks if `artworkId` doesn't match any artwork.
 *
 * @param artworks The full pool of artworks to select from.
 * @param artworkId The id of the artwork to select neighbors around. If it
 *                  doesn't match any artwork, falls back to the most recently
 *                  added artworks.
 * @param options.limit Caps the number of artworks returned. If omitted, all
 *                      matching artworks are returned. If 0 or negative,
 *                      returns an empty array.
 * @returns `artworkId`'s artwork and its nearest neighbors, capped at `limit`,
 *          ordered newest-first.
 */
export function selectNearest(
  artworks: ArtworkData[],
  artworkId: string,
  {limit}: SelectOptions = {}
): ArtworkData[] {
  if (limit !== undefined && limit <= 0) return [];

  const sorted = [...artworks].sort(byNewestFirst);
  const targetIndex = sorted.findIndex((a) => a.id === artworkId);
  const effectiveLimit = limit ?? sorted.length; // No limit - return everything

  // No id match - return most recent instead
  if (targetIndex === -1) return sorted.slice(0, effectiveLimit);

  const result = [sorted[targetIndex]];
  let newerPtr = targetIndex - 1; // Walks toward index 0 (newer pieces)
  let olderPtr = targetIndex + 1; // Walks toward the end (older pieces)
  let preferNewerNext = true; // Alternate so neighbors are pulled evenly

  while (
    result.length < effectiveLimit &&
    (newerPtr >= 0 || olderPtr < sorted.length)
  ) {
    const canTakeNewer = newerPtr >= 0;
    const canTakeOlder = olderPtr < sorted.length;
    const takeNewer = preferNewerNext ? canTakeNewer : !canTakeOlder;

    if (takeNewer && canTakeNewer) {
      result.push(sorted[newerPtr]);
      newerPtr -= 1;
    } else if (canTakeOlder) {
      result.push(sorted[olderPtr]);
      olderPtr += 1;
    }

    preferNewerNext = !preferNewerNext;
  }

  return result.sort(byNewestFirst);
}
