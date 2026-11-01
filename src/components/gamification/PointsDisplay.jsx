import { motion, AnimatePresence } from 'framer-motion';

const PointsDisplay = ({ points = 0, addedPoints = 0 }) => {
  return (
    <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-accent-300 rounded-2xl px-4 py-2 shadow-sm">
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-2xl select-none"
      >
        ⭐
      </motion.span>
      <span className="font-display font-extrabold text-accent-700 text-lg">
        {points}
      </span>
      <span className="text-xs font-display font-bold uppercase text-accent-600">
        puntos
      </span>

      <AnimatePresence>
        {addedPoints > 0 && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -25, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute -top-3 right-0 font-display font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full text-xs shadow-sm"
          >
            +{addedPoints}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PointsDisplay;

