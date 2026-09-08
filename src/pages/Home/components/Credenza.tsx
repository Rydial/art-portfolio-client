import type {ReactNode} from "react";
import {useId} from "react";

import styles from "./Credenza.module.scss";

interface CredenzaProps {
  children?: ReactNode;
}

// Front face, viewed straight on
const FRONT_LEFT = 20;
const FRONT_RIGHT = 380;
const FRONT_TOP = 60; // Where the front face meets the top surface
const FRONT_BOTTOM = 130; // The cropped bottom edge

// Top face: rises by TOP_RISE and insets by TOP_INSET on each side
const TOP_RISE = 20;
const TOP_INSET = 25;

const topFacePoints = `
  ${FRONT_LEFT},${FRONT_TOP}
  ${FRONT_RIGHT},${FRONT_TOP}
  ${FRONT_RIGHT - TOP_INSET},${FRONT_TOP - TOP_RISE}
  ${FRONT_LEFT + TOP_INSET},${FRONT_TOP - TOP_RISE}
`;

// Tight viewBox: exactly bounds the front face + top face, no slack.
const viewBoxMinX = FRONT_LEFT;
const viewBoxMinY = FRONT_TOP - TOP_RISE;
const viewBoxWidth = FRONT_RIGHT - FRONT_LEFT;
const viewBoxHeight = FRONT_BOTTOM - viewBoxMinY;

export function Credenza({children}: CredenzaProps) {
  const uid = useId();

  // ---- Callbacks ------------------------------------------------------------
  const id = (name: string) => `${name}-${uid}`;

  // ---- Body -----------------------------------------------------------------
  return (
    <div className={styles.wrap}>
      <svg
        viewBox={`
          ${viewBoxMinX} ${viewBoxMinY} ${viewBoxWidth} ${viewBoxHeight}
        `}
        className={styles.svg}
      >
        <defs>
          <linearGradient id={id("front")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3624" />
            <stop offset="100%" stopColor="#3B2A1E" />
          </linearGradient>

          <linearGradient id={id("top")} x1="0" y1="1" x2="0.4" y2="0">
            <stop offset="0%" stopColor="#5c4530" />
            <stop offset="100%" stopColor="#3f2e20" />
          </linearGradient>

          <filter id={id("grain")} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.4"
              numOctaves={3}
              seed={11}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.55 0.55 0.55 0 -0.32"
            />
          </filter>

          <clipPath id={id("front-clip")}>
            <rect
              x={FRONT_LEFT}
              y={FRONT_TOP}
              width={FRONT_RIGHT - FRONT_LEFT}
              height={FRONT_BOTTOM - FRONT_TOP}
              rx="1.5"
            />
          </clipPath>
          <clipPath id={id("top-clip")}>
            <polygon points={topFacePoints} />
          </clipPath>

          {/* Crop-fade matches $color-bg (#E8DFD1) — literal because
              inline SVG can't consume SCSS variables; keep in sync by
              hand if the wall tone in _variables.scss ever changes. */}
          <linearGradient id={id("crop-fade")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8DFD1" stopOpacity="0" />
            <stop offset="100%" stopColor="#E8DFD1" stopOpacity="1" />
          </linearGradient>
        </defs>

        <polygon points={topFacePoints} fill={`url(#${id("top")})`} />
        <g
          clipPath={`url(#${id("top-clip")})`}
          style={{mixBlendMode: "overlay"}}
        >
          <rect
            x={viewBoxMinX}
            y={viewBoxMinY}
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="#2a1c12"
            filter={`url(#${id("grain")})`}
            opacity={0.6}
          />
        </g>

        <rect
          x={FRONT_LEFT}
          y={FRONT_TOP}
          width={FRONT_RIGHT - FRONT_LEFT}
          height={FRONT_BOTTOM - FRONT_TOP}
          fill={`url(#${id("front")})`}
          rx="1.5"
        />
        <g
          clipPath={`url(#${id("front-clip")})`}
          style={{mixBlendMode: "overlay"}}
        >
          <rect
            x={viewBoxMinX}
            y={viewBoxMinY}
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="#2a1c12"
            filter={`url(#${id("grain")})`}
            opacity={0.5}
          />
        </g>

        {/* Top/front seam: highlight + adjacent shadow */}
        <line
          x1={FRONT_LEFT}
          y1={FRONT_TOP}
          x2={FRONT_RIGHT}
          y2={FRONT_TOP}
          stroke="#B08D57"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <line
          x1={FRONT_LEFT}
          y1={FRONT_TOP + 1.5}
          x2={FRONT_RIGHT}
          y2={FRONT_TOP + 1.5}
          stroke="#0c0803"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
      </svg>

      {children}
    </div>
  );
}
