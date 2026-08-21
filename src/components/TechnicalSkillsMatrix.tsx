import React, { useMemo } from 'react';
import { Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  SolarSkillsMapProps, OrbitConfig, 
  DEFAULT_ORBIT_CONFIGS, getSkillIcon 
} from './skills/skillsTypes';
import { BentoSkillCard } from './skills/BentoSkillCard';

export { getSkillIcon };

export default function TechnicalSkillsMatrix({
  skills,
  skillSearch,
  getCategoryDetails
}: SolarSkillsMapProps) {
  
  // Reuse the existing config mapping but purely for colors & themes
  const orbitConfigs: OrbitConfig[] = useMemo(() => DEFAULT_ORBIT_CONFIGS, []);

  const getOrbitConfig = (category: string): OrbitConfig => {
    const found = orbitConfigs.find(
      c => c.categoryName.toLowerCase().includes(category.toLowerCase()) || 
           category.toLowerCase().includes(c.categoryName.toLowerCase())
    );
    if (found) return found;
    
    const index = skills.findIndex(s => s.category === category) % orbitConfigs.length;
    return {
      ...orbitConfigs[index >= 0 ? index : 0],
      categoryName: category
    };
  };

  return (
    <div id="skills-matrix-hub" className="space-y-8 text-left mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-800 tracking-widest uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Technical Architecture
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 max-w-lg leading-relaxed">
            A comprehensive overview of my engineering stack, spanning modern frontend interfaces, resilient backend architectures, and data-driven security analysis tools.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {skills.map((cat, idx) => {
          const details = getCategoryDetails(cat.category);
          const config = getOrbitConfig(cat.category);
          const IconComponent = details.icon;

          return (
            <BentoSkillCard
              key={cat.category}
              category={cat}
              details={details}
              config={config}
              IconComponent={IconComponent}
              skillSearch={skillSearch}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
