import {useMemo} from "react";
import {useLocation} from "react-router-dom";

import {artworks} from "@/data/artworks";
import {buildRooms} from "@/lib/buildRooms";
import {useNavigationStore} from "@/store/useNavigationStore";
import type {GalleryLocationState} from "@/types/gallery";

import {Hallway} from "./components/Hallway";
import styles from "./GalleryPage.module.scss";

export function GalleryPage() {
  const location = useLocation();
  const galleryMode = useNavigationStore((s) => s.galleryMode);

  const rooms = useMemo(() => buildRooms(artworks), []);

  // ---- Derived --------------------------------------------------------------
  const locationState = location.state as GalleryLocationState | null;
  const arrivalArtworkId = locationState?.artworkId;

  // ---- Body -----------------------------------------------------------------
  return (
    <main className={styles.viewport}>
      {galleryMode === "walkthrough" ? (
        <div key={"walkthrough"} className={styles.layer}>
          <Hallway rooms={rooms} arrivalArtworkId={arrivalArtworkId} />
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
