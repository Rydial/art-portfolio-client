import {AnimatePresence, motion} from "motion/react";
import {useNavigate} from "react-router-dom";

import type {Artwork} from "@/types/artwork";

import {useSlideshow} from "../hooks/useSlideshow";
import styles from "./FramedArtwork.module.scss";

interface FramedArtworkProps {
  artworks: Artwork[];
}

export function FramedArtwork({artworks}: FramedArtworkProps) {
  const navigate = useNavigate();
  const {index} = useSlideshow({
    length: artworks.length
  });
  const artwork = artworks[index];

  // ---- Callbacks ------------------------------------------------------------
  const enterGallery = () => {
    navigate("/gallery");
  };

  // ---- Body -----------------------------------------------------------------
  return (
    <div className={styles.wrapper}>
      <motion.button
        type={"button"}
        className={styles.frame}
        layoutId={`artwork-frame-${artwork.id}`}
        onClick={enterGallery}
        whileHover={{scale: 1.01}}
        transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
      >
        <div className={styles.matting}>
          <div className={styles["image-stack"]}>
            <AnimatePresence mode="sync">
              <motion.img
                key={artwork.id}
                src={artwork.imageUrl}
                alt={artwork.title}
                className={styles.image}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.9, ease: "easeInOut"}}
              />
              <motion.div
                key={`glint-${artwork.id}`}
                className={styles.glint}
                initial={{opacity: 0}}
                animate={{opacity: [0, 1, 0]}}
                exit={{opacity: 0}}
                transition={{duration: 0.9, ease: "easeInOut"}}
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
