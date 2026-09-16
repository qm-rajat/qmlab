import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';

export interface TypewriterRole {
  title: string;
  shortLabel: string;
  abbreviation: string;
  colorClass: string;
  accentHex: string;
}

export const ROLES: TypewriterRole[] = [
  {
    title: "Technical Product Manager",
    shortLabel: "Product Manager",
    abbreviation: "PM",
    colorClass: "from-amber-500 via-orange-500 to-rose-500",
    accentHex: "#d97706"
  },
  {
    title: "Full-Stack Developer",
    shortLabel: "Full-Stack Dev",
    abbreviation: "DEV",
    colorClass: "from-blue-600 to-indigo-600",
    accentHex: "#2563eb"
  },
  {
    title: "Technical SEO Expert",
    shortLabel: "Technical SEO",
    abbreviation: "SEO",
    colorClass: "from-emerald-600 to-teal-600",
    accentHex: "#059669"
  },
  {
    title: "IT Support | Application Support Engineer",
    shortLabel: "IT Support | App Engineer",
    abbreviation: "Support Engineer",
    colorClass: "from-purple-600 to-pink-600",
    accentHex: "#9333ea"
  }
];

const COLOR_PALETTES = [
  { colorClass: "from-amber-500 via-orange-500 to-rose-500", accentHex: "#d97706" },
  { colorClass: "from-blue-600 to-indigo-600", accentHex: "#2563eb" },
  { colorClass: "from-emerald-600 to-teal-600", accentHex: "#059669" },
  { colorClass: "from-purple-600 to-pink-600", accentHex: "#9333ea" },
  { colorClass: "from-cyan-500 to-blue-600", accentHex: "#06b6d4" },
];

// Consistent speed constants (in milliseconds)
const TYPE_SPEED = 30;     // Fast & uniform character typing
const BACKSPACE_SPEED = 18; // Fast backspace
const PAUSE_END = 1200;    // Pause on completed word
const PAUSE_START = 150;   // Pause before typing next word

interface TypewriterRolesProps {
  externalRoleIndex?: number;
  onRoleChange?: (index: number) => void;
  showInlineNav?: boolean;
  tagline?: string;
  roles?: TypewriterRole[];
}

export const TypewriterRoles: React.FC<TypewriterRolesProps> = ({
  externalRoleIndex,
  onRoleChange,
  showInlineNav = false,
  tagline,
  roles: customRoles
}) => {
  const [internalRoleIndex, setInternalRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Compute active roles dynamically based on tagline or customRoles
  const activeRoles: TypewriterRole[] = useMemo(() => {
    if (customRoles && customRoles.length > 0) return customRoles;
    if (tagline && tagline.trim()) {
      const parts = tagline.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        return parts.map((title, i) => {
          const matched = ROLES.find(
            r => r.title.toLowerCase() === title.toLowerCase() || r.shortLabel.toLowerCase() === title.toLowerCase()
          );
          if (matched) return matched;
          const palette = COLOR_PALETTES[i % COLOR_PALETTES.length];
          return {
            title,
            shortLabel: title,
            abbreviation: title.slice(0, 3).toUpperCase(),
            colorClass: palette.colorClass,
            accentHex: palette.accentHex,
          };
        });
      }
    }
    return ROLES;
  }, [tagline, customRoles]);

  const roleIndex = (externalRoleIndex !== undefined ? externalRoleIndex : internalRoleIndex) % activeRoles.length;
  const currentRole = activeRoles[roleIndex] || activeRoles[0] || ROLES[0];

  const setRole = (newIdx: number) => {
    setIsDeleting(false);
    setCurrentText('');
    if (onRoleChange) {
      onRoleChange(newIdx);
    } else {
      setInternalRoleIndex(newIdx);
    }
  };

  useEffect(() => {
    const fullText = currentRole.title;
    let delay = TYPE_SPEED;

    if (!isDeleting) {
      // Forward typing
      if (currentText.length < fullText.length) {
        delay = TYPE_SPEED;
      } else {
        // Reached full word, hold before backspacing
        delay = PAUSE_END;
      }
    } else {
      // Backspacing
      if (currentText.length > 0) {
        delay = BACKSPACE_SPEED;
      } else {
        // Done deleting, quick breather before next word
        delay = PAUSE_START;
      }
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          const nextIdx = (roleIndex + 1) % activeRoles.length;
          if (onRoleChange) {
            onRoleChange(nextIdx);
          } else {
            setInternalRoleIndex(nextIdx);
          }
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, currentRole.title, onRoleChange, activeRoles.length]);

  return (
    <div className="pt-2 pb-1 space-y-2 select-none">
      {/* Fast Animated Typewriter Headline */}
      <div id="hero-typewriter-container" className="flex items-center gap-2 min-h-[36px] sm:min-h-[44px]">
        <span className="text-base sm:text-xl md:text-2xl font-bold text-slate-400 font-mono">
          {'>'}
        </span>
        
        <div className="relative inline-flex items-center">
          <span
            id="hero-typewriter-role-text"
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r ${currentRole.colorClass} bg-clip-text text-transparent transition-all duration-150 font-sans`}
          >
            {currentText}
          </span>

          {/* Glowing Blinking Cursor */}
          <motion.span
            id="hero-typewriter-cursor"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            className="inline-block w-[3px] h-6 sm:h-7 md:h-8 ml-1.5 rounded-full"
            style={{ backgroundColor: currentRole.accentHex }}
          />
        </div>
      </div>

      {/* Optional Inline Role Navigation Steppers */}
      {showInlineNav && (
        <div className="flex items-center gap-1.5 pt-0.5">
          {activeRoles.map((role, idx) => {
            const isActive = idx === roleIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setRole(idx)}
                title={`Switch to ${role.title}`}
                className="group flex items-center gap-1 cursor-pointer p-0.5"
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'w-6'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  style={{
                    backgroundColor: isActive ? role.accentHex : undefined
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TypewriterRoles;
