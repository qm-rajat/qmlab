import React from 'react';
// @ts-expect-error - PNG files are natively handled by Vite bundler
import logoImg from '../assets/images/LOGO.png';

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
    xs: { img: 'h-6 sm:h-7 w-auto', title: 'text-sm', subtitle: 'text-[7px]' },
    sm: { img: 'h-8 sm:h-9 w-auto', title: 'text-lg', subtitle: 'text-[9px]' },
    md: { img: 'h-12 sm:h-14 w-auto', title: 'text-2xl', subtitle: 'text-[11px]' },
    lg: { img: 'h-16 sm:h-20 w-auto', title: 'text-4xl', subtitle: 'text-[13px]' },
    xl: { img: 'h-24 sm:h-28 w-auto', title: 'text-5xl', subtitle: 'text-[14px]' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className} ${interactive ? 'group' : ''}`}>
      <img
        src={logoImg}
        alt="QM Labs Logo"
        referrerPolicy="no-referrer"
        className={`${currentSize.img} object-contain transition-transform duration-500 ease-out ${interactive ? 'group-hover:scale-105' : ''}`}
      />

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
