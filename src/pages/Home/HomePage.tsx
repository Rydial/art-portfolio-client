import {artworks} from "@/data/artworks";
import {selectFeaturedArtworks} from "@/lib/selectFeaturedArtworks";

import {FramedArtwork} from "./components/FramedArtwork";
import styles from "./HomePage.module.scss";

export function HomePage() {
  const slideshowArtworks = selectFeaturedArtworks(artworks, {limit: 5});

  // ---- Body -----------------------------------------------------------------
  return (
    <main className={styles.scene}>
      <FramedArtwork artworks={slideshowArtworks} />
    </main>
  );
}
