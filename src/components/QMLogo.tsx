import React from 'react';

interface QMLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export default function QMLogo({
  className = '',
  showTagline = false,
  size = 'md',
  interactive = true,
}: QMLogoProps) {
  const sizeMap = {
    xs: { svg: 'w-10 h-10', title: 'text-sm', subtitle: 'text-[7px]' },
    sm: { svg: 'w-20 h-12', title: 'text-lg', subtitle: 'text-[9px]' },
    md: { svg: 'w-36 h-20', title: 'text-2xl', subtitle: 'text-[11px]' },
    lg: { svg: 'w-52 h-28', title: 'text-4xl', subtitle: 'text-[13px]' },
    xl: { svg: 'w-[280px] h-40', title: 'text-5xl', subtitle: 'text-[14px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className} ${interactive ? 'group' : ''}`}>
      {/* Scalable SVG Logo */}
      <svg
        viewBox="0 0 240 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSize.svg} transition-transform duration-500 ease-out ${interactive ? 'group-hover:scale-105' : ''}`}
      >
        <defs>
          {/* Radial Gradient for QM Icon */}
          <radialGradient id="qmGradient" cx="20%" cy="30%" r="80%" fx="20%" fy="30%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0084ff" />
            <stop offset="100%" stopColor="#0052cc" />
          </radialGradient>
          {/* Linear Accent Gradient */}
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00a8ff" />
            <stop offset="100%" stopColor="#002d80" />
          </linearGradient>
          {/* Inner Drop Shadows */}
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Light glow ring under interactive hover */}
        {interactive && (
          <ellipse
            cx="120"
            cy="50"
            rx="110"
            ry="45"
            stroke="url(#qmGradient)"
            strokeWidth="0.75"
            strokeDasharray="6 8"
            className="opacity-20 group-hover:opacity-60 transition-opacity duration-700 animate-[spin_60s_linear_infinite]"
          />
        )}

        {/* Q Letter (Styled with rounded path and diagonal tail cut) */}
        <path
          d="M 20,45 C 20,25 35,15 55,15 C 75,15 90,25 90,45 C 90,65 75,75 55,75 C 44,75 35,70 28,64 L 15,75 L 10,65 L 26,54 C 22,50 20,45 20,45 Z"
          fill="url(#qmGradient)"
          filter="url(#logoGlow)"
          className="transition-all duration-300"
        />
        {/* Q Letter Inner Hole */}
        <ellipse cx="55" cy="45" rx="14" ry="15" fill="#ffffff" className="group-hover:fill-slate-50 transition-colors" />
        
        {/* Stylized custom inner tail overlap cut for Q */}
        <path
          d="M 64,55 L 85,76 L 73,83 L 53,62 Z"
          fill="url(#qmGradient)"
        />

        {/* M Letter (Modern curved corners to reflect professional, smooth aesthetic) */}
        <path
          d="M 105,75 L 105,17 C 105,17 115,15 125,15 C 131,15 137,21 140,28 C 143,21 149,15 155,15 C 165,15 175,17 175,17 L 175,75 L 161,75 L 161,34 C 161,31 157,28 153,28 C 149,28 145,31 145,34 L 145,75 L 135,75 L 135,34 C 135,31 131,28 127,28 C 123,28 119,31 119,34 L 119,75 L 105,75 Z"
          fill="url(#qmGradient)"
          filter="url(#logoGlow)"
        />

        {/* LABS text underneath in sleek wide design */}
        <text
          x="120"
          y="93"
          textAnchor="middle"
          fill="#1e293b"
          fontSize="17"
          fontWeight="800"
          letterSpacing="12"
          className="font-sans select-none tracking-[12px]"
        >
          LABS
        </text>
      </svg>

      {/* Philosophy Taglines with custom alignment */}
      {showTagline && (
        <div className="mt-3 flex flex-col items-center justify-center space-y-1 text-center select-none no-print">
          <p className={`${currentSize.title} font-semibold text-slate-800 tracking-wide font-sans`}>
            Quality Builds Trust.
          </p>
          <p className={`${currentSize.subtitle} font-mono text-slate-500 uppercase tracking-widest`}>
            Momentum Drives Growth.
          </p>
        </div>
      )}
    </div>
  );
}
