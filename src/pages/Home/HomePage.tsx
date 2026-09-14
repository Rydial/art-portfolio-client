import {artworks} from "@/data/artworks";
import {selectFeatured} from "@/lib/artworkSelect";

import {Credenza} from "./components/Credenza";
import {FramedArtwork} from "./components/FramedArtwork";
import styles from "./HomePage.module.scss";
import {useSlideshow} from "./hooks/useSlideshow";

export function HomePage() {
  const slideshowArtworks = selectFeatured(artworks, {limit: 5, fill: true});
  const {index, pause, resume} = useSlideshow({
    length: slideshowArtworks.length
  });

  // ---- Derived --------------------------------------------------------------
  const artwork = slideshowArtworks[index];

  // ---- Body -----------------------------------------------------------------
  return (
    <main className={styles.viewport}>
      <div className={styles.scaler}>
        <div className={styles.content}>
          <FramedArtwork
            artwork={artwork}
            onPauseHover={pause}
            onResumeHover={resume}
          />
          <Credenza></Credenza>
        </div>
      </div>
      <div className={styles.floor} />
    </main>
  );
}
