import React from 'react';

interface OrigamiBirdProps {
  className?: string;
  size?: number;
  height?: number | string;
  width?: number | string;
}

/**
 * OrigamiBird Component
 * Exact 1:1 recreation of "Origami Magenta Bird Logo.png":
 * - Tightly bounded viewBox eliminates empty padding so the bird scales to its true, prominent size
 * - Authentic polygonal origami facets
 * - Uniform crisp white separation lines between each geometric facet
 * - Signature rich bKash magenta with subtle folded beak accent
 */
export const OrigamiBird: React.FC<OrigamiBirdProps> = ({
  className = '',
  size,
  height,
  width,
}) => {
  // If size, height, or width is explicitly specified, use it. Otherwise, let CSS className handle sizing via viewBox.
  const resolvedHeight = height ?? size;
  const resolvedWidth = width ?? (typeof resolvedHeight === 'number' ? Math.round(resolvedHeight * (58 / 82)) : undefined);

  return (
    <svg
      width={resolvedWidth}
      height={resolvedHeight}
      viewBox="23 9 58 83"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
      aria-label="bKash Origami Bird Logo"
    >
      <defs>
        {/* Subtle drop shadow matching high-res render */}
        <filter id="origamiShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.12" floodColor="#D8005A" />
        </filter>
      </defs>

      <g filter="url(#origamiShadow)">
        {/* 1. Flap under the main wing (far-left secondary wing accent) */}
        <polygon
          points="26,19 35,30 31,18"
          fill="#C20E5C"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 2. Main large upper-left wing */}
        <polygon
          points="45,48 27,12 53,16"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 3. Central upper body triangle (chest/back) */}
        <polygon
          points="45,48 53,16 68,54"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 4. Lower body triangle (abdomen) */}
        <polygon
          points="45,48 68,54 49,70"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 5. Sharp elongated tail pointing down-left */}
        <polygon
          points="45,48 49,70 36,89"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 6. Neck triangle leading to head */}
        <polygon
          points="68,54 60,36 73,31"
          fill="#E2136E"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 7. Folded beak triangle pointing right */}
        <polygon
          points="73,31 71,41 78,38"
          fill="#C20E5C"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default OrigamiBird;
