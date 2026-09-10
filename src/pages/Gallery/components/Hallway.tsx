import {useLayoutEffect, useRef} from "react";

import type {Room} from "@/types/gallery";

import styles from "./Hallway.module.scss";

interface HallwayProps {
  rooms: Room[];
  arrivalArtworkId?: string;
}

export function Hallway({rooms, arrivalArtworkId}: HallwayProps) {
  const roomRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ---- Effects --------------------------------------------------------------

  // Arrive already inside the room of the selected artwork
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

  // ---- Body -----------------------------------------------------------------
  return (
    <div className={styles.hallway}>
      <div className={styles.track}></div>
      <div className={styles.runner} />
    </div>
  );
}
