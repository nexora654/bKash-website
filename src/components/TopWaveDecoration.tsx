import React from 'react';

/**
 * TopWaveDecoration Component
 * Exact 1:1 vector recreation of "Translucent Pink Corner Wave.png":
 * - Full-width responsive top banner with wave occupying the top-left ~48%
 * - Three overlapping translucent flowing curved pink waves
 * - Smooth natural blending and transparency leaving the logo area pristine
 */
export const TopWaveDecoration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block max-h-[160px] sm:max-h-[190px]"
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          {/* Main top wave gradient - rich vibrant bKash magenta */}
          <linearGradient
            id="userTopWaveGrad"
            x1="0"
            y1="0"
            x2="480"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E2136E" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#EA1974" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#F5257E" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#FF388E" stopOpacity="0.82" />
          </linearGradient>

          {/* Middle translucent wave gradient */}
          <linearGradient
            id="userMidWaveGrad"
            x1="0"
            y1="0"
            x2="320"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E2136E" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#FF2A85" stopOpacity="0.48" />
            <stop offset="85%" stopColor="#FF529B" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#FF77B0" stopOpacity="0.25" />
          </linearGradient>

          {/* Lowest soft petal wave gradient */}
          <linearGradient
            id="userLowWaveGrad"
            x1="0"
            y1="60"
            x2="180"
            y2="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF2A85" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#FF5C9D" stopOpacity="0.25" />
            <stop offset="85%" stopColor="#FF85BA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFB3D5" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* 1. Lowest faint translucent wave (deepest down the left edge ~420px) */}
        <path
          d="M 0 0 L 210 0 C 170 85, 115 210, 62 310 C 35 360, 15 395, 0 420 Z"
          fill="url(#userLowWaveGrad)"
        />

        {/* 2. Middle translucent wave (creating the overlapping translucent crescent) */}
        <path
          d="M 0 0 L 320 0 C 275 60, 205 160, 132 240 C 78 300, 32 328, 0 345 Z"
          fill="url(#userMidWaveGrad)"
        />

        {/* 3. Main upper saturated wave (sweeping across to ~480px) */}
        <path
          d="M 0 0 L 485 0 C 430 18, 365 65, 295 120 C 215 182, 125 240, 0 282 Z"
          fill="url(#userTopWaveGrad)"
        />
      </svg>
    </div>
  );
};

export default TopWaveDecoration;
