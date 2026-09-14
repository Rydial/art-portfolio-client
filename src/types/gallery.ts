import type {ArtworkCategory, ArtworkData} from "./artwork";

export type GalleryMode = "walkthrough" | "directory";

export interface GalleryLocationState {
  artworkId?: string;
}

export interface RoomData {
  category: ArtworkCategory;
  label: string; // Display label, e.g. "Still life" for "still-life"
  artworks: ArtworkData[]; // Every artwork in this category
}
