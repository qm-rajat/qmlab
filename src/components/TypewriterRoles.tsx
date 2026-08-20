import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterRole {
  title: string;
  colorClass: string;
  accentHex: string;
}

const ROLES: TypewriterRole[] = [
  {
    title: "Full-Stack Developer",
    colorClass: "from-blue-600 to-indigo-600",
    accentHex: "#2563eb"
  },
  {
    title: "Technical SEO Expert",
    colorClass: "from-emerald-600 to-teal-600",
    accentHex: "#059669"
  },
  {
    title: "QA Automation Engineer",
    colorClass: "from-purple-600 to-pink-600",
    accentHex: "#9333ea"
  }
];

// Consistent speed constants (in milliseconds)
const TYPE_SPEED = 30;     // Fast & uniform character typing
const BACKSPACE_SPEED = 18; // Fast backspace
const PAUSE_END = 1200;    // Pause on completed word
const PAUSE_START = 150;   // Pause before typing next word

export const TypewriterRoles: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRole = ROLES[roleIndex];

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
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, currentRole.title]);

  return (
    <div className="pt-2 pb-1 space-y-2 select-none">
      {/* Fast Animated Typewriter Headline */}
      <div className="flex items-center gap-2 min-h-[36px] sm:min-h-[44px]">
        <span className="text-base sm:text-xl md:text-2xl font-bold text-slate-400 font-mono">
          {'>'}
        </span>
        
        <div className="relative inline-flex items-center">
          <span
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r ${currentRole.colorClass} bg-clip-text text-transparent transition-all duration-150 font-sans`}
          >
            {currentText}
          </span>

          {/* Glowing Blinking Cursor */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            className="inline-block w-[3px] h-6 sm:h-7 md:h-8 ml-1.5 rounded-full"
            style={{ backgroundColor: currentRole.accentHex }}
          />
        </div>
      </div>

      {/* Role Navigation Steppers */}
      <div className="flex items-center gap-1.5 pt-0.5">
        {ROLES.map((role, idx) => {
          const isActive = idx === roleIndex;
          return (
            <button
              key={idx}
              onClick={() => {
                setIsDeleting(false);
                setCurrentText('');
                setRoleIndex(idx);
              }}
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
    </div>
  );
};

export default TypewriterRoles;
