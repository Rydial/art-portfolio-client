import clsx from "clsx";
import type {CSSProperties} from "react";

import type {ArtworkData} from "@/types/artwork";

import {
  ARTWORK_FRAME_THICKNESS,
  ARTWORK_MATTING_THICKNESS
} from "../constants/artwork";
import styles from "./FramedArtwork.module.scss";

interface FramedArtworkProps {
  artwork: ArtworkData;
  width: number; // Full frame footprint — image area + frame border
  height: number;
  x: number; // Left edge within the room's scene boundary
  y: number; // Top edge within the room's scene boundary
  highlighted?: boolean;
}

export function FramedArtwork({
  artwork,
  width,
  height,
  x,
  y,
  highlighted
}: FramedArtworkProps) {
  // ---- View -----------------------------------------------------------------
  const cssVars = {
    "--frame-thickness": `${ARTWORK_FRAME_THICKNESS}px`,
    "--matting-thickness": `${ARTWORK_MATTING_THICKNESS}px`
  } as CSSProperties;

  // ---- Body -----------------------------------------------------------------
  return (
    <figure
      className={clsx(
        styles.frame,
        highlighted && styles["frame--highlighted"]
      )}
      style={{left: x, top: y, width, height, ...cssVars}}
    >
      <div className={styles.matting}>
        <img src={artwork.imageUrl} alt={artwork.title} />
      </div>
    </figure>
  );
}
