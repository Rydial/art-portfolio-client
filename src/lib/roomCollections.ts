import type {ArtworkData} from "@/types/artwork";
import type {RoomCollectionId, RoomData} from "@/types/gallery";

import {selectFeatured, selectNearest, selectRecent} from "./artworkSelect";

/**
 * Determines which collection a room should open on when first displayed.
 *
 * @param room The room to determine the default collection for.
 * @param arrivalArtworkId The id of the artwork the user arrived at, if any.
 * @returns `"nearest"` if `arrivalArtworkId` belongs to `room`, otherwise
 *          `"recent"`.
 */
export function getDefaultCollectionId(
  room: RoomData,
  arrivalArtworkId?: string
): RoomCollectionId {
  const isArrivalRoom =
    !!arrivalArtworkId && room.artworks.some((a) => a.id === arrivalArtworkId);

  return isArrivalRoom ? "nearest" : "recent";
}

/**
 * Resolves a room's artworks for the given collection, delegating to the
 * matching `select*` helper and capping the result at `limit`, if provided.
 *
 * - `"nearest"` falls back to `selectRecent` if `arrivalArtworkId` is omitted,
 * since there's no artwork to select neighbors around
 *
 * @param room The room whose artworks to select from.
 * @param collectionId Which collection to resolve.
 * @param arrivalArtworkId The id of the artwork the user arrived at, used only
 *                         when `collectionId` is `"nearest"`.
 * @param limit Caps the number of artworks returned. If omitted, all matching
 *              artworks are returned.
 * @returns The artworks for `collectionId`, capped at `limit` if provided,
 *          using each helper's default ordering.
 */
export function getCollectionArtworks(
  room: RoomData,
  collectionId: RoomCollectionId,
  arrivalArtworkId?: string,
  limit?: number
): ArtworkData[] {
  switch (collectionId) {
    case "featured":
      return selectFeatured(room.artworks, {limit});

    case "nearest":
      return arrivalArtworkId
        ? selectNearest(room.artworks, arrivalArtworkId, {limit})
        : selectRecent(room.artworks, {limit});

    case "recent":
      return selectRecent(room.artworks, {limit});
  }
}
