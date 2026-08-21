import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { OrbitConfig, CategoryDetails, getSkillIcon } from './skillsTypes';
import { SiteSettings } from '../../types';

interface BentoSkillCardProps {
  category: SiteSettings['skills'][0];
  details: CategoryDetails;
  config: OrbitConfig;
  IconComponent: LucideIcon;
  skillSearch: string;
}

export const BentoSkillCard: React.FC<BentoSkillCardProps> = ({
  category,
  details,
  config,
  IconComponent,
  skillSearch,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`p-6 rounded-[24px] bg-white border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group`}
    >
      {/* Background Accent Gradient */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-[40px] pointer-events-none transition-transform duration-700 group-hover:scale-[1.5]"
        style={{ backgroundColor: config.accentHex }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
          style={{ 
            backgroundColor: config.accentHex, 
            color: '#ffffff' 
          }}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h5 className="text-[15px] font-black tracking-tight text-slate-900 leading-tight">
            {category.category}
          </h5>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
            {category.items.length} Technologies
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <motion.div 
        className="flex flex-wrap gap-2.5 relative z-10"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
        }}
      >
        {category.items.map((item, sIdx) => {
          const skillName = typeof item === 'string' ? item : item.name;
          const SkillIconComp = getSkillIcon(skillName, category.category);
          
          const isMatch = skillName.toLowerCase().includes(skillSearch.toLowerCase());
          const isDimmed = skillSearch.trim() !== '' && !isMatch;

          return (
            <motion.div
              key={sIdx}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold font-sans border transition-all duration-200 ${
                isDimmed 
                  ? 'opacity-25 bg-slate-50 border-slate-100 text-slate-400' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs hover:-translate-y-0.5'
              }`}
            >
              <div 
                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{ color: config.accentHex }}
              >
                <SkillIconComp className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{skillName}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
