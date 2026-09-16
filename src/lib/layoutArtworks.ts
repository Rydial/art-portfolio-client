import seedrandom from "seedrandom";

import type {ArtworkData} from "@/types/artwork";
import type {Dimensions} from "@/types/common";

interface ArtworkPlacement {
  x: number; // Left edge, relative to the scene boundary
  y: number; // Top edge, relative to the scene boundary
  width: number; // Scaled image width + border thickness
  height: number; // Scaled image height + border thickness
}

interface LayoutOptions {
  artworkBorderThickness?: number; // Fixed, unscaled border
  gap?: number; // Fixed, unscaled gap between cells
}

/**
 * Packs artworks of arbitrary aspect ratios into `boundary` without overlap,
 * scaling them all up or down together by one shared factor.
 *
 * @param boundary The space to pack artworks into.
 * @param artworks The artworks to place.
 * @param seed Deterministic seed for the randomized positioning.
 * @param options.artworkBorderThickness Fixed, unscaled border around the
 *                                       artwork image. Defaults to 0. Throws if
 *                                       it's greater than or equal to a grid
 *                                       cell's width or height.
 * @param options.gap Fixed, unscaled space reserved between adjacent grid
 *                    cells. Defaults to 0. Throws if the total gap leaves no
 *                    room for actual cell content in the boundary.
 * @returns A placement (position and scaled size including border) per artwork.
 */
export function layoutArtworks(
  boundary: Dimensions,
  artworks: ArtworkData[],
  seed: string,
  {artworkBorderThickness = 0, gap = 0}: LayoutOptions = {}
): Record<string, ArtworkPlacement> {
  const placements: Record<string, ArtworkPlacement> = {};
  if (artworks.length === 0) return placements;

  const rng = seedrandom(seed);

  // Layout artwork placement grid
  const cols = Math.ceil(Math.sqrt(artworks.length));
  const rows = Math.ceil(artworks.length / cols);

  const totalGapWidth = (cols - 1) * gap;
  const totalGapHeight = (rows - 1) * gap;

  if (totalGapWidth >= boundary.width || totalGapHeight >= boundary.height) {
    throw new Error(`
      layoutArtworks: gap (${gap}) leaves no room for cells in a ${cols}x${rows}
      grid within boundary (${boundary.width}x${boundary.height})
    `);
  }

  const cellWidth = (boundary.width - totalGapWidth) / cols;
  const cellHeight = (boundary.height - totalGapHeight) / rows;

  if (
    artworkBorderThickness >= cellWidth ||
    artworkBorderThickness >= cellHeight
  ) {
    throw new Error(`
      layoutArtworks: artworkBorderThickness (${artworkBorderThickness}) does 
      not fit within a grid cell (${cellWidth}x${cellHeight})
    `);
  }

  // Use largest scale where every artwork fits their cell as the shared scale
  const sharedScale = Math.min(
    ...artworks.map((artwork) =>
      Math.min(
        (cellWidth - artworkBorderThickness) / artwork.imageWidth,
        (cellHeight - artworkBorderThickness) / artwork.imageHeight
      )
    )
  );

  artworks.forEach((artwork, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const cellLeft = col * (cellWidth + gap);
    const cellTop = row * (cellHeight + gap);

    const width = artwork.imageWidth * sharedScale + artworkBorderThickness;
    const height = artwork.imageHeight * sharedScale + artworkBorderThickness;

    const slackX = Math.max(0, cellWidth - width);
    const slackY = Math.max(0, cellHeight - height);

    placements[artwork.id] = {
      x: cellLeft + rng() * slackX,
      y: cellTop + rng() * slackY,
      width,
      height
    };
  });

  return placements;
}
