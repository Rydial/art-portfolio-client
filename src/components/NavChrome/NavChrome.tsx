import clsx from "clsx";
import {useNavigate} from "react-router-dom";

import {useNavigationStore} from "@/store/useNavigationStore";

import {DirectoryIcon, HomeIcon, WalkthroughIcon} from "./icons";
import styles from "./NavChrome.module.scss";

interface NavChromeProps {
  showHome?: boolean;
  showDirectoryToggle?: boolean;
}

export function NavChrome({
  showHome = true,
  showDirectoryToggle = false
}: NavChromeProps) {
  const navigate = useNavigate();
  const galleryMode = useNavigationStore((s) => s.galleryMode);
  const setGalleryMode = useNavigationStore((s) => s.setGalleryMode);

  // ---- Derived --------------------------------------------------------------
  const isWalkthrough = galleryMode === "walkthrough";

  // ---- Callbacks ------------------------------------------------------------
  const goHome = () => {
    navigate("/");
  };

  const toggleDirectory = () => {
    setGalleryMode(isWalkthrough ? "directory" : "walkthrough");
  };

  // ---- View -----------------------------------------------------------------
  const DirectoryToggleIcon = isWalkthrough ? DirectoryIcon : WalkthroughIcon;
  const directoryLabel = isWalkthrough ? "Directory" : "Walkthrough";

  // ---- Body -----------------------------------------------------------------
  return (
    <nav className={styles.chrome}>
      {/* Home Button */}
      {showHome && (
        <button
          type={"button"}
          className={clsx(styles.button, styles["button--home"])}
          onClick={goHome}
        >
          <HomeIcon className={styles.icon} />
          Home
        </button>
      )}

      {/* Directory Toggle Button */}
      {showDirectoryToggle && (
        <button
          type={"button"}
          className={clsx(styles.button, styles["button--directory-toggle"])}
          onClick={toggleDirectory}
        >
          <DirectoryToggleIcon className={styles.icon} />

          {/* 
            Fixed-width text stack: ghost text reserves space for the longest 
            label so the button doesn't resize
          */}
          <div className={styles["text-stack"]}>
            <span className={styles["ghost-text"]}>Walkthrough</span>
            <span className={styles["active-text"]}>{directoryLabel}</span>
          </div>
        </button>
      )}
    </nav>
  );
}
