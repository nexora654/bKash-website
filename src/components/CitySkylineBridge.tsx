import React from 'react';

/**
 * CitySkylineBridge Component
 * Faithfully matches the bottom section of the reference image:
 * - Layered modern pink city skyline with Dhaka towers and spires
 * - Cable-stayed bridge spanning across with pylon and radiating cables
 * - Center sky with the flying geometric bKash magenta origami bird
 * - Bottom wave curves framing the base in pink
 */
export const CitySkylineBridge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Sky gentle glow gradient in soft bKash rose */}
          <linearGradient id="skyGrad" x1="300" y1="0" x2="300" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FDF2F7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FCE7F3" stopOpacity="0.85" />
          </linearGradient>

          {/* Far background skyline in soft rose */}
          <linearGradient id="farBuildings" x1="0" y1="100" x2="0" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.6" />
          </linearGradient>

          {/* Near skyline in warm magenta */}
          <linearGradient id="nearBuildings" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#BE185D" stopOpacity="0.75" />
          </linearGradient>

          {/* Bridge structure gradient */}
          <linearGradient id="bridgeGrad" x1="0" y1="160" x2="600" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C20E5C" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#E2136E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9E0047" stopOpacity="0.9" />
          </linearGradient>

          {/* Base gradient */}
          <linearGradient id="baseWaterGrad" x1="300" y1="210" x2="300" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C20E5C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E2136E" stopOpacity="1" />
          </linearGradient>

          {/* Bird gradients */}
          <linearGradient id="smallBirdWing" x1="280" y1="30" x2="340" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3388" />
            <stop offset="70%" stopColor="#E2136E" />
            <stop offset="100%" stopColor="#C20E5C" />
          </linearGradient>

          <linearGradient id="smallBirdDeep" x1="285" y1="40" x2="315" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C20E5C" />
            <stop offset="100%" stopColor="#88003C" />
          </linearGradient>
        </defs>

        {/* Sky wash */}
        <rect width="600" height="240" fill="url(#skyGrad)" />

        {/* --- 1. FLYING ORIGAMI BIRD IN SKY (Exact match to Origami Magenta Bird Logo.png) --- */}
        <g transform="translate(255, 12) scale(1.18)">
          {/* 1. Flap under the main wing */}
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

        {/* --- 2. FAR BACKGROUND CITY SKYLINE --- */}
        <g fill="url(#farBuildings)">
          {/* Far left low buildings */}
          <rect x="0" y="180" width="22" height="60" />
          <rect x="18" y="165" width="16" height="75" />
          <rect x="32" y="172" width="20" height="68" />
          <rect x="50" y="155" width="24" height="85" />
          {/* Left-center towers */}
          <rect x="72" y="168" width="18" height="72" />
          <rect x="88" y="145" width="22" height="95" />
          <polygon points="99,128 88,145 110,145" /> {/* Spire */}
          <rect x="108" y="158" width="18" height="82" />
          {/* Prominent main tower with spire */}
          <rect x="124" y="130" width="24" height="110" />
          <polygon points="136,88 124,130 148,130" />
          <line x1="136" y1="78" x2="136" y2="88" stroke="#F472B6" strokeWidth="2" />
          {/* Adjacent towers */}
          <rect x="146" y="142" width="20" height="98" />
          <rect x="164" y="138" width="26" height="102" />
          <polygon points="177,118 164,138 190,138" />
          <rect x="188" y="160" width="20" height="80" />
          <rect x="206" y="166" width="22" height="74" />
          <rect x="226" y="175" width="18" height="65" />

          {/* Right side background towers (behind bridge) */}
          <rect x="360" y="175" width="24" height="65" />
          <rect x="382" y="168" width="20" height="72" />
          <rect x="400" y="160" width="22" height="80" />
          <rect x="420" y="150" width="24" height="90" />
          <polygon points="432,132 420,150 444,150" />
          <rect x="442" y="162" width="20" height="78" />
          <rect x="530" y="170" width="28" height="70" />
          <rect x="556" y="162" width="22" height="78" />
          <rect x="576" y="175" width="24" height="65" />
        </g>

        {/* --- 3. MIDGROUND DETAILED SKYLINE (Left and center) --- */}
        <g fill="url(#nearBuildings)">
          {/* Far left modern blocks */}
          <rect x="10" y="185" width="24" height="55" rx="1" />
          <rect x="36" y="178" width="22" height="62" rx="1" />
          {/* Stepped corporate tower */}
          <rect x="56" y="170" width="18" height="70" />
          <rect x="72" y="156" width="20" height="84" />
          {/* Modern high-rise with glass facade slits */}
          <rect x="90" y="148" width="26" height="92" rx="2" />
          <rect x="94" y="152" width="3" height="40" fill="#FCE7F3" opacity="0.6" />
          <rect x="101" y="152" width="3" height="40" fill="#FCE7F3" opacity="0.6" />
          <rect x="108" y="152" width="3" height="40" fill="#FCE7F3" opacity="0.6" />

          {/* Main tallest skyscraper */}
          <rect x="122" y="136" width="28" height="104" rx="2" />
          <polygon points="136,96 122,136 150,136" fill="#BE185D" />
          <line x1="136" y1="82" x2="136" y2="96" stroke="#F472B6" strokeWidth="2.5" />
          {/* Window bands on main tower */}
          <rect x="126" y="142" width="20" height="2" fill="#FCE7F3" opacity="0.7" />
          <rect x="126" y="150" width="20" height="2" fill="#FCE7F3" opacity="0.7" />
          <rect x="126" y="158" width="20" height="2" fill="#FCE7F3" opacity="0.7" />
          <rect x="126" y="166" width="20" height="2" fill="#FCE7F3" opacity="0.7" />

          {/* Adjacent rounded/angled crown tower */}
          <rect x="156" y="146" width="24" height="94" rx="2" />
          <polygon points="168,124 156,146 180,146" fill="#BE185D" />
          <rect x="186" y="165" width="22" height="75" />
          <rect x="214" y="176" width="20" height="64" />
        </g>

        {/* --- 4. CABLE-STAYED BRIDGE (Spanning right-half and center) --- */}
        <g>
          {/* Bridge Road Deck (slight curve) */}
          <path
            d="M 230 206 C 300 204, 450 200, 600 202 L 600 212 C 450 210, 300 214, 230 216 Z"
            fill="url(#bridgeGrad)"
          />
          <path
            d="M 230 204 C 300 202, 450 198, 600 200"
            stroke="#FBCFE8"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Bridge Under-Piers / Arched Supports */}
          <path
            d="M 260 215 Q 280 230 300 215 L 305 240 L 255 240 Z"
            fill="#BE185D"
            opacity="0.7"
          />
          <path
            d="M 315 214 Q 340 230 365 214 L 370 240 L 310 240 Z"
            fill="#BE185D"
            opacity="0.7"
          />
          <path
            d="M 380 212 Q 405 228 430 212 L 435 240 L 375 240 Z"
            fill="#BE185D"
            opacity="0.7"
          />
          <path
            d="M 505 210 Q 535 226 565 210 L 570 240 L 500 240 Z"
            fill="#BE185D"
            opacity="0.7"
          />

          {/* MAIN BRIDGE PYLON (Cable Tower on the Right - around x=470) */}
          {/* Twin diamond/A-frame pylon struts */}
          <polygon
            points="464,138 474,138 468,225 458,225"
            fill="#C20E5C"
          />
          <polygon
            points="474,138 484,138 490,225 480,225"
            fill="#9E0047"
          />
          {/* Pylon Crown / Top Needle */}
          <polygon
            points="470,126 478,126 475,138 467,138"
            fill="#E2136E"
          />
          <line x1="474" y1="116" x2="474" y2="126" stroke="#FF80BF" strokeWidth="2.5" />
          {/* Crossbeam between pylon legs */}
          <rect x="464" y="168" width="20" height="4" fill="#F472B6" opacity="0.9" />

          {/* STAY CABLES (Radiating fan from pylon crown down to road deck) */}
          <g stroke="#FCE7F3" strokeWidth="1" strokeOpacity="0.85">
            {/* Left fan cables */}
            <line x1="472" y1="140" x2="350" y2="204" />
            <line x1="472" y1="142" x2="375" y2="203" />
            <line x1="472" y1="144" x2="400" y2="202" />
            <line x1="472" y1="146" x2="425" y2="202" />
            <line x1="472" y1="148" x2="445" y2="201" />

            {/* Right fan cables */}
            <line x1="476" y1="140" x2="585" y2="202" />
            <line x1="476" y1="142" x2="560" y2="202" />
            <line x1="476" y1="144" x2="535" y2="201" />
            <line x1="476" y1="146" x2="510" y2="201" />
            <line x1="476" y1="148" x2="492" y2="201" />
          </g>
        </g>

        {/* --- 5. FOREGROUND SWOOPING WAVES AT SIDES (Matching reference image) --- */}
        {/* Left swooping wave */}
        <path
          d="M 0 200 C 60 195, 140 215, 200 240 L 0 240 Z"
          fill="#F472B6"
          fillOpacity="0.3"
        />
        <path
          d="M 0 215 C 80 208, 160 226, 220 240 L 0 240 Z"
          fill="#E2136E"
          fillOpacity="0.4"
        />

        {/* Right swooping wave */}
        <path
          d="M 400 240 C 460 220, 540 205, 600 215 L 600 240 Z"
          fill="#F472B6"
          fillOpacity="0.3"
        />
        <path
          d="M 440 240 C 500 225, 560 218, 600 225 L 600 240 Z"
          fill="#E2136E"
          fillOpacity="0.35"
        />

        {/* Bottom water base line */}
        <rect x="0" y="235" width="600" height="5" fill="url(#baseWaterGrad)" />
      </svg>
    </div>
  );
};

export default CitySkylineBridge;
