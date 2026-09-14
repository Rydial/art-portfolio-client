import type {ArtworkCategory, ArtworkData} from "@/types/artwork";
import type {RoomData} from "@/types/gallery";

import {formatLabel} from "./formatLabel";

/**
 * Groups artworks into rooms by category, preserving the order in which each
 * category first appears in `artworks`.
 *
 * @param artworks The artworks to group.
 * @returns One room per distinct category, in first-occurrence order.
 */
export function buildRooms(artworks: ArtworkData[]): RoomData[] {
  const order: ArtworkCategory[] = [];
  const byCategory = new Map<ArtworkCategory, ArtworkData[]>();

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
