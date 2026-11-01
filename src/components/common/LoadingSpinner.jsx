import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Cargando diversión...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4">
      <motion.div
        className="text-6xl select-none"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🤖
      </motion.div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce"></div>
      </div>
      <p className="font-display font-semibold text-primary-600 text-lg">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
