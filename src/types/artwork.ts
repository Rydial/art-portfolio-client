export type ArtworkCategory =
  | "landscape"
  | "portrait"
  | "still-life"
  | "abstract"
  | (string & {});

export type ArtworkMedium = "oil-paint" | (string & {});

export interface Artwork {
  id: string;
  slug: string; // Used for the artwork's own route: /artwork/:slug
  title: string;
  category: ArtworkCategory;
  medium: ArtworkMedium;
  dimensions: string;
  description?: string; // Optional
  imageUrl: string;
  featured: boolean; // Whether or not it's part of the Home slideshow
  dateAdded: string; // ISO format
}
