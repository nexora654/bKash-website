import React from 'react';

interface BKashLogoProps {
  className?: string;
  height?: number | string;
}

/**
 * BKashLogo Component
 * Exact 1:1 vector recreation of "bKash Origami Bird Logo.png":
 * - Authentic "bKash" wordmark ('b' in signature magenta #E2136E, 'Kash' in pure black)
 * - Single-story geometric letterforms matching the official brand identity
 * - Exact geometric origami bird positioned beside the text
 * - Crisp white crease lines between facets and folded beak accent
 */
export const BKashLogo: React.FC<BKashLogoProps> = ({
  className = '',
  height = 54,
}) => {
  return (
    <svg
      viewBox="0 0 290 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height }}
      className={`inline-block w-auto max-w-full select-none ${className}`}
      aria-label="bKash Logo"
      role="img"
    >
      <defs>
        {/* Subtle drop shadow for premium depth */}
        <filter id="logoBirdShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.12" floodColor="#D8005A" />
        </filter>
      </defs>

      {/* ============================================================== */}
      {/* 1. WORDMARK: "bKash" (Matches exact typography of 1.png & logo) */}
      {/* ============================================================== */}
      <g id="wordmark">
        {/* --- Letter 'b' (Signature bKash Magenta #E2136E) --- */}
        {/* Vertical stem */}
        <path
          d="M 12 18 L 19 18 L 19 68 L 12 68 Z"
          fill="#E2136E"
        />
        {/* Circular Bowl with hollow inner cutout */}
        <path
          d="M 18 35.5 C 22.5 35.5, 36.5 36.5, 36.5 51.5 C 36.5 66.5, 22.5 67.5, 18 67.5 Z M 19 41.5 C 23.5 41.5, 29.5 43.5, 29.5 51.5 C 29.5 59.5, 23.5 61.5, 19 61.5 Z"
          fill="#E2136E"
        />

        {/* --- Letter 'K' (Pure Black #000000) --- */}
        {/* Tall vertical stem */}
        <rect x="44" y="18" width="7" height="50" rx="0.5" fill="#000000" />
        {/* Upper diagonal arm */}
        <polygon points="50,47 67,20 75.5,20 56,48.5" fill="#000000" />
        {/* Lower diagonal leg */}
        <polygon points="53,45 74.5,68 65,68 47.5,49" fill="#000000" />

        {/* --- Letter 'a' (Single-Story Geometric Sans) --- */}
        {/* Right vertical stem */}
        <path d="M 97 36 L 103.5 36 L 103.5 68 L 97 68 Z" fill="#000000" />
        {/* Round bowl */}
        <path
          d="M 80 52 C 80 43, 85 36, 98 36 L 98 42 C 89 42, 87 46, 87 52 C 87 58, 89 62, 98 62 L 98 68 C 85 68, 80 61, 80 52 Z"
          fill="#000000"
        />

        {/* --- Letter 's' --- */}
        <path
          d="M 129 42.5 C 127 38.5, 123 36, 117.5 36 C 111.5 36, 108 39.5, 108 44 C 108 48.5, 111 50.5, 117 52.5 C 124.5 55, 129 57.5, 129 63 C 129 69, 123.5 71.5, 116.5 71.5 C 110 71.5, 105.5 68, 104 63.5 L 110 61 C 111 63.5, 113.5 66, 116.5 66 C 120 66, 122.5 64.5, 122.5 62 C 122.5 59, 120 57.5, 114 55 C 107.5 52.5, 102 49.5, 102 43.5 C 102 38, 107 33, 117.5 33 C 123.5 33, 128 35.5, 131 40 Z"
          fill="#000000"
        />

        {/* --- Letter 'h' --- */}
        {/* Tall vertical stem */}
        <rect x="135" y="18" width="7" height="50" rx="0.5" fill="#000000" />
        {/* Rounded Arch & Right leg */}
        <path
          d="M 141 44.5 C 144 38.5, 149 35.5, 156 35.5 C 163 35.5, 166.5 39.5, 166.5 47 L 166.5 68 L 159.5 68 L 159.5 48 C 159.5 43.5, 157.5 41.5, 153 41.5 C 148.5 41.5, 143 44.5, 141 49 Z"
          fill="#000000"
        />
      </g>

      {/* ============================================================== */}
      {/* 2. ORIGAMI BIRD: Exact geometry of "bKash Origami Bird Logo.png"*/}
      {/* ============================================================== */}
      <g id="origamiBird" filter="url(#logoBirdShadow)">
        {/* 1. Flap under the main wing (far-left secondary wing accent) */}
        <polygon
          points="172,21 181,32 177,20"
          fill="#C20E5C"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 2. Main large upper-left wing */}
        <polygon
          points="191,50 173,14 199,18"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 3. Central upper body triangle (chest/back) */}
        <polygon
          points="191,50 199,18 214,56"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 4. Lower body triangle (abdomen) */}
        <polygon
          points="191,50 214,56 195,72"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 5. Sharp elongated tail pointing down-left */}
        <polygon
          points="191,50 195,72 182,91"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 6. Neck triangle leading to head */}
        <polygon
          points="214,56 206,38 219,33"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* 7. Folded beak triangle pointing right */}
        <polygon
          points="219,33 217,43 224,40"
          fill="#C20E5C"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default BKashLogo;
