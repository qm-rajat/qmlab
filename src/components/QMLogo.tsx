import React from 'react';
// @ts-expect-error - PNG files are natively handled by Vite bundler
import logoImg from '../assets/images/LOGO.png';

interface QMLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  usePng?: boolean;
}

export default function QMLogo({
  className = '',
  showTagline = false,
  size = 'md',
  interactive = true,
  usePng = true,
}: QMLogoProps) {
  const sizeMap = {
    xs: { img: 'h-6 sm:h-7 w-auto', title: 'text-sm', subtitle: 'text-[7px]' },
    sm: { img: 'h-8 sm:h-9 w-auto', title: 'text-lg', subtitle: 'text-[9px]' },
    md: { img: 'h-12 sm:h-14 w-auto', title: 'text-2xl', subtitle: 'text-[11px]' },
    lg: { img: 'h-16 sm:h-20 w-auto', title: 'text-4xl', subtitle: 'text-[13px]' },
    xl: { img: 'h-24 sm:h-28 w-auto', title: 'text-5xl', subtitle: 'text-[14px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className} ${interactive ? 'group' : ''}`}>
      {usePng ? (
        <img
          src={logoImg}
          alt="QM Labs Logo"
          referrerPolicy="no-referrer"
          className={`${currentSize.img} object-contain transition-transform duration-500 ease-out ${interactive ? 'group-hover:scale-105' : ''}`}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className={`${currentSize.img} object-contain transition-transform duration-500 ease-out ${interactive ? 'group-hover:scale-105' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Beautiful Brand Gradients */}
            <linearGradient id="qmBlueCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="qmIndigoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="qmOrangePulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Glowing effect filters */}
            <filter id="qmGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <style>{`
            @keyframes qmRotateClockwise {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes qmRotateCounterClockwise {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes qmPulseGlow {
              0%, 100% { transform: scale(1); opacity: 0.85; filter: drop-shadow(0 0 2px rgba(37, 99, 235, 0.2)); }
              50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.45)); }
            }
            @keyframes qmDashOffset {
              to { stroke-dashoffset: -40; }
            }
            @keyframes qmOrbitMove {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            .qm-spin-slow {
              transform-origin: 50px 50px;
              animation: qmRotateClockwise 25s linear infinite;
            }
            .qm-spin-reverse {
              transform-origin: 50px 50px;
              animation: qmRotateCounterClockwise 18s linear infinite;
            }
            .qm-pulse-core {
              transform-origin: 50px 50px;
              animation: qmPulseGlow 3.5s ease-in-out infinite;
            }
            .qm-dash-flow {
              stroke-dasharray: 8, 12;
              animation: qmDashOffset 2.5s linear infinite;
            }
            .qm-orbit {
              transform-origin: 50px 50px;
              animation: qmOrbitMove 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
          `}</style>

          {/* Background glow node circle */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="1" />

          {/* Outer spinning dash indexer (Radar strategy) */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#qmBlueCyan)"
            strokeWidth="1.25"
            strokeDasharray="4 8"
            className="qm-spin-slow"
            opacity="0.7"
          />

          {/* Inner spinning telemetry ring */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#qmIndigoBlue)"
            strokeWidth="1.5"
            className="qm-dash-flow qm-spin-reverse"
            opacity="0.8"
          />

          {/* Orbit glowing particle indicator (The speed insights probe) */}
          <g className="qm-orbit">
            <circle cx="50" cy="6" r="3.5" fill="url(#qmOrangePulse)" filter="url(#qmGlow)" />
            <circle cx="50" cy="6" r="1.5" fill="#ffffff" />
          </g>

          {/* Geometric Core element (Hexagonal quality frame) */}
          <polygon
            points="50,18 78,34 78,66 50,82 22,66 22,34"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Central Monogram Emblem - Letter 'Q' and 'M' */}
          <g className="qm-pulse-core">
            {/* Monogram 'Q' */}
            <circle
              cx="38"
              cy="50"
              r="10"
              fill="none"
              stroke="url(#qmBlueCyan)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Sleek diagonal tail for Q */}
            <path
              d="M 45,57 L 52,64"
              stroke="url(#qmBlueCyan)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Monogram 'M' */}
            <path
              d="M 57,61 L 57,39 L 64,48 L 71,39 L 71,61"
              fill="none"
              stroke="url(#qmIndigoBlue)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}

      {/* Philosophy Taglines with custom alignment */}
      {showTagline && (
        <div className="mt-3 flex flex-col items-center justify-center space-y-1 text-center select-none no-print">
          <p className={`${currentSize.title} font-semibold text-slate-850 tracking-wide font-sans`}>
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
