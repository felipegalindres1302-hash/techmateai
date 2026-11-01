import { motion } from 'framer-motion';

const StreakCounter = ({ days = 0, size = 'md' }) => {
  const sizeMap = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-xl px-6 py-3',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-display font-bold shadow-md ${
        sizeMap[size] || sizeMap.md
      }`}
    >
      <motion.span
        animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="select-none text-xl"
      >
        🔥
      </motion.span>
      <span>
        {days} {days === 1 ? 'día' : 'días'} de racha
      </span>
    </motion.div>
  );
};

export default StreakCounter;
