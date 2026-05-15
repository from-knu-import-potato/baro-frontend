import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  dark: boolean;
  toggleTheme: () => void;
}

const ThemeToggle = ({ dark, toggleTheme }: ThemeToggleProps) => {
  return (
    <div className="cursor-pointer select-none scale-80" onClick={toggleTheme}>
      <div
        className={cn(
          'relative w-16 h-8 flex items-center rounded-full px-1.5 transition-colors duration-500 ',
          dark ? 'bg-baro-blue/20' : 'bg-baro-blue/50',
        )}
      >
        <div className="absolute inset-0 flex items-center justify-between px-2 text-white/50">
          <Sun size={14} className={cn('transition-opacity', !dark && 'text-white opacity-100')} />
          <Moon size={14} className={cn('transition-opacity', dark && 'text-white opacity-100')} />
        </div>

        <motion.div
          className="z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          initial={false}
          animate={{ x: dark ? 30 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {dark ? (
            <Moon size={12} className="text-gray-800" />
          ) : (
            <Sun size={12} className="text-gray-400" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeToggle;
