import {motion} from 'framer-motion';
import type {LucideIcon} from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.6, delay}}
      className="group text-center p-8 rounded-lg hover:bg-white/50 transition-all duration-500 backdrop-blur-sm"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center group-hover:bg-[#8A9A7B]/20 transition-all duration-500 group-hover:scale-110">
        <Icon className="w-8 h-8 text-[#6B7A64]" />
      </div>
      <h3 className="mb-3 text-[#4A5943]">{title}</h3>
      <p className="text-[#6B7A64] opacity-80">{description}</p>
    </motion.div>
  );
}
