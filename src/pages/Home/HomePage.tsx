import {artworks} from "@/data/artworks";
import {selectFeaturedArtworks} from "@/lib/selectFeaturedArtworks";

import {Credenza} from "./components/Credenza";
import {FramedArtwork} from "./components/FramedArtwork";
import styles from "./HomePage.module.scss";
import {useSlideshow} from "./hooks/useSlideshow";

export function HomePage() {
  const slideshowArtworks = selectFeaturedArtworks(artworks, {limit: 5});
  const {index, pause, resume} = useSlideshow({
    length: slideshowArtworks.length
  });
  const artwork = slideshowArtworks[index];

  // ---- Body -----------------------------------------------------------------
  return (
    <main className={styles.viewport}>
      <div className={styles.stage}>
        <FramedArtwork
          artwork={artwork}
          onPauseHover={pause}
          onResumeHover={resume}
        />
        <Credenza></Credenza>
      </div>
      <div className={styles.floor} />
    </main>
  );
}
