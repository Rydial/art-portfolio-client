import {useEffect, useLayoutEffect, useRef, useState} from "react";

import {getDefaultCollectionId} from "@/lib/roomCollections";
import type {ArtworkCategory} from "@/types/artwork";
import type {RoomCollectionId, RoomData} from "@/types/gallery";

import styles from "./Hallway.module.scss";
import {Room} from "./Room";

interface HallwayProps {
  rooms: RoomData[];
  arrivalArtworkId?: string;
}

export function Hallway({rooms, arrivalArtworkId}: HallwayProps) {
  const [collectionByRoom, setCollectionByRoom] = useState<
    Record<string, RoomCollectionId>
  >(() =>
    Object.fromEntries(
      rooms.map((room) => [
        room.category,
        getDefaultCollectionId(room, arrivalArtworkId)
      ])
    )
  );

  const trackRef = useRef<HTMLDivElement | null>(null);
  const roomRefs = useRef<Map<ArtworkCategory, HTMLDivElement>>(new Map());
  const scrollFractionRef = useRef<number>(0);

  // ---- Callbacks ------------------------------------------------------------

  const handleTrackScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    scrollFractionRef.current =
      track.scrollWidth > 0 ? track.scrollLeft / track.scrollWidth : 0;
  };

  // ---- Effects --------------------------------------------------------------

  // Arrive already inside the room of the selected artwork - only runs once
  useLayoutEffect(() => {
    if (!arrivalArtworkId) return;

    const arrivalRoom = rooms.find((room) =>
      room.artworks.some((a) => a.id === arrivalArtworkId)
    );

    const target = arrivalRoom
      ? roomRefs.current.get(arrivalRoom.category)
      : null;

    target?.scrollIntoView({
      behavior: "auto",
      inline: "start",
      block: "nearest"
    });
  }, [arrivalArtworkId, rooms]);

  // Snap to nearest room during resize
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(() => {
      const roomIndex = Math.round(scrollFractionRef.current * rooms.length);
      const targetScrollLeft = (roomIndex / rooms.length) * track.scrollWidth;
      track.scrollLeft = targetScrollLeft;
    });

    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [rooms.length]);

  // ---- Body -----------------------------------------------------------------
  return (
    <div className={styles.hallway}>
      <div className={styles.track} ref={trackRef} onScroll={handleTrackScroll}>
        {rooms.map((room) => (
          <div
            key={room.category}
            ref={(el) => {
              if (el) roomRefs.current.set(room.category, el);
              else roomRefs.current.delete(room.category);
            }}
            className={styles.bay}
          >
            <Room
              room={room}
              arrivalArtworkId={arrivalArtworkId}
              collectionId={collectionByRoom[room.category]}
              onChangeCollection={(collectionId) =>
                setCollectionByRoom((prev) => ({
                  ...prev,
                  [room.category]: collectionId
                }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
