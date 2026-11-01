import { motion, AnimatePresence } from 'framer-motion';

const AchievementPopup = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.6, opacity: 0, y: 30 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-accent-400 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Confetti background sparkles */}
          <div className="absolute top-2 left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-2 right-4 text-2xl animate-bounce [animation-delay:-0.2s]">✨</div>
          <div className="absolute bottom-4 left-6 text-xl">⭐</div>
          <div className="absolute bottom-4 right-6 text-xl">🌟</div>

          <p className="text-xs font-display font-extrabold uppercase tracking-widest text-accent-600 mb-1">
            ¡Nuevo Logro Desbloqueado!
          </p>

          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
            className="w-24 h-24 mx-auto my-3 bg-gradient-to-tr from-accent-200 to-yellow-100 rounded-3xl flex items-center justify-center text-6xl shadow-inner border-2 border-accent-300"
          >
            {achievement.icon || '🏆'}
          </motion.div>

          <h3 className="font-display font-bold text-dark text-2xl">
            {achievement.nameEs || achievement.name}
          </h3>

          <p className="font-body text-gray-600 text-sm mt-2">
            {achievement.descriptionEs || achievement.description}
          </p>

          <div className="my-4 inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-4 py-1.5 rounded-full font-display font-bold text-sm border border-accent-200">
            ⭐ +{achievement.rewardPoints || 50} puntos de recompensa
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-full btn-accent py-3 rounded-2xl text-base shadow-lg"
          >
            ¡Genial, gracias! 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AchievementPopup;

