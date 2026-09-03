import type {Artwork} from "@/types/artwork";

export const artworks: Artwork[] = [
  {
    id: "a1",
    slug: "orchard-in-late-light",
    title: "Orchard in Late Light",
    category: "landscape",
    medium: "oil-paint",
    dimensions: "24 x 30 in",
    description: `
      A late-afternoon study of the orchard behind the old stone wall, painted
      over three sittings.
    `,
    imageUrl: "https://picsum.photos/seed/orchard-in-late-light/800/600",
    featured: true,
    dateAdded: "2024-09-12"
  },
  {
    id: "a2",
    slug: "quiet-harbor",
    title: "Quiet Harbor",
    category: "landscape",
    medium: "oil-paint",
    dimensions: "18 x 24 in",
    imageUrl: "https://picsum.photos/seed/quiet-harbor/800/600",
    featured: false,
    dateAdded: "2023-11-02"
  },
  {
    id: "a3",
    slug: "study-of-a-reader",
    title: "Study of a Reader",
    category: "portrait",
    medium: "oil-paint",
    dimensions: "16 x 20 in",
    description: "My grandmother, mid-page, unaware she was being watched.",
    imageUrl: "https://picsum.photos/seed/study-of-a-reader/800/600",
    featured: true,
    dateAdded: "2024-11-30"
  },
  {
    id: "a4",
    slug: "self-portrait-in-brass-light",
    title: "Self-Portrait in Brass Light",
    category: "portrait",
    medium: "oil-paint",
    dimensions: "20 x 24 in",
    imageUrl: "https://picsum.photos/seed/self-portrait-in-brass-light/800/600",
    featured: false,
    dateAdded: "2022-04-18"
  },
  {
    id: "a5",
    slug: "pears-and-pewter",
    title: "Pears and Pewter",
    category: "still-life",
    medium: "oil-paint",
    dimensions: "12 x 16 in",
    imageUrl: "https://picsum.photos/seed/pears-and-pewter/800/600",
    featured: true,
    dateAdded: "2025-02-06"
  },
  {
    id: "a6",
    slug: "the-collectors-desk",
    title: "The Collector's Desk",
    category: "still-life",
    medium: "oil-paint",
    dimensions: "20 x 20 in",
    description: `
      Ink, a magnifying glass, a moth pinned under glass — the objects on the 
      desk where this whole project started.\
    `,
    imageUrl: "https://picsum.photos/seed/the-collectors-desk/800/600",
    featured: false,
    dateAdded: "2023-07-21"
  }
];
