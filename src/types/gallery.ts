import type {Artwork, ArtworkCategory} from "./artwork";

export type GalleryMode = "walkthrough" | "directory";

export interface GalleryLocationState {
  artworkId?: string;
}

export interface Room {
  category: ArtworkCategory;
  label: string; // Display label, e.g. "Still life" for "still-life"
  artworks: Artwork[]; // Every artwork in this category
}
