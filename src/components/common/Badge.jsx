import { motion } from 'framer-motion';

const Badge = ({
  icon = '🏆',
  name = 'Logro',
  description = '',
  earned = false,
  rewardPoints = 50,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className={`relative rounded-3xl p-4 flex flex-col items-center text-center transition-all ${
        earned
          ? 'bg-gradient-to-b from-yellow-50 to-amber-100 border-2 border-accent-300 shadow-md'
          : 'bg-gray-100 border-2 border-dashed border-gray-300 opacity-60'
      }`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-2 shadow-inner ${
          earned ? 'bg-white' : 'bg-gray-200 grayscale'
        }`}
      >
        {icon}
      </div>

      <h4 className="font-display font-bold text-dark text-base">{name}</h4>
      {description && (
        <p className="font-body text-xs text-gray-600 mt-1 line-clamp-2">
          {description}
        </p>
      )}

      <div className="mt-2 inline-flex items-center gap-1 text-xs font-display font-bold text-accent-700 bg-white/80 px-2.5 py-1 rounded-full border border-accent-200">
        ⭐ +{rewardPoints} pts
      </div>

      {earned && (
        <div className="absolute top-2 right-2 text-xs bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
          ✓
        </div>
      )}
    </motion.div>
  );
};

export default Badge;

