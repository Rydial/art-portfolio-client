import {type CSSProperties} from "react";

import styles from "./Room.module.scss";

const ROOM_CONTENT_WIDTH: number = 1100;
const ROOM_CONTENT_HEIGHT: number = 800;

export function Room() {
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
        <div className={styles.content}></div>
      </div>
    </section>
  );
}
