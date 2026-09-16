import {type CSSProperties, useMemo} from "react";

import {layoutArtworks} from "@/lib/layoutArtworks";
import {getCollectionArtworks} from "@/lib/roomCollections";
import type {RoomCollectionId, RoomData} from "@/types/gallery";

import {
  ARTWORK_FRAME_THICKNESS,
  ARTWORK_MATTING_THICKNESS
} from "../constants/artwork";
import {
  ROOM_ARTWORK_CAP,
  ROOM_ARTWORK_GAP,
  ROOM_CONTENT_HEIGHT,
  ROOM_CONTENT_WIDTH
} from "../constants/gallery";
import {FramedArtwork} from "./FramedArtwork";
import styles from "./Room.module.scss";

interface RoomProps {
  room: RoomData;
  arrivalArtworkId?: string;
  collectionId: RoomCollectionId;
  onChangeCollection: (collectionId: RoomCollectionId) => void;
}

export function Room({
  room,
  arrivalArtworkId,
  collectionId
  /* onChangeCollection */
}: RoomProps) {
  // ---- Memoized -------------------------------------------------------------
  const artworks = useMemo(
    () =>
      getCollectionArtworks(
        room,
        collectionId,
        arrivalArtworkId,
        ROOM_ARTWORK_CAP
      ),
    [room, collectionId, arrivalArtworkId]
  );
  const placements = useMemo(
    () =>
      layoutArtworks(
        {width: ROOM_CONTENT_WIDTH, height: ROOM_CONTENT_HEIGHT},
        artworks,
        `${room.category}:${collectionId}:${artworks
          .map((a) => a.id)
          .join(",")}`,
        {
          artworkBorderThickness:
            ARTWORK_FRAME_THICKNESS * 2 + ARTWORK_MATTING_THICKNESS * 2,
          gap: ROOM_ARTWORK_GAP
        }
      ),
    [artworks, collectionId, room.category]
  );

  // ---- View -----------------------------------------------------------------
  const cssVars = {
    "--room-content-width": `${ROOM_CONTENT_WIDTH}px`,
    "--room-content-height": `${ROOM_CONTENT_HEIGHT}px`
  } as CSSProperties;

  // ---- Body -----------------------------------------------------------------
  return (
    <section className={styles.room} style={cssVars}>
      {/* Hallway Appurtenances */}
      <div className={styles.wall} />
      <div className={styles.floor} />

      {/* Contents */}
      <div className={styles.scaler}>
        <div className={styles.content}>
          {artworks.map((artwork) => {
            const placement = placements[artwork.id];
            if (!placement) return null;

            return (
              <FramedArtwork
                key={artwork.id}
                artwork={artwork}
                width={placement.width}
                height={placement.height}
                x={placement.x}
                y={placement.y}
                highlighted={artwork.id === arrivalArtworkId}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
