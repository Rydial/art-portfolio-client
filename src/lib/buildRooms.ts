import type {Artwork, ArtworkCategory} from "@/types/artwork";
import type {Room} from "@/types/gallery";

import {formatLabel} from "./formatLabel";

/**
 * Groups artworks into rooms by category. Rooms appear in the order their
 * category first occurs in `artworks`.
 *
 * @param artworks The artworks to group. An empty array returns an empty
 *   array of rooms.
 * @returns An array of rooms.
 */
export function buildRooms(artworks: Artwork[]): Room[] {
  const order: ArtworkCategory[] = [];
  const byCategory = new Map<ArtworkCategory, Artwork[]>();

  for (const artwork of artworks) {
    if (!byCategory.has(artwork.category)) {
      byCategory.set(artwork.category, []);
      order.push(artwork.category);
    }

    byCategory.get(artwork.category)!.push(artwork);
  }

  return order.map((category) => ({
    category,
    label: formatLabel(category),
    artworks: byCategory.get(category)!
  }));
}
