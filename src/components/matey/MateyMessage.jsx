import { motion } from 'framer-motion';

const MateyMessage = ({
  message = '',
  type = 'info',
  showSpeaker = false,
  onSpeak,
}) => {
  const typeStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-primary-300',
      text: 'text-primary-900',
      icon: '💡',
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      icon: '🎉',
    },
    error: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-900',
      icon: '💪',
    },
    hint: {
      bg: 'bg-amber-50',
      border: 'border-accent-300',
      text: 'text-amber-900',
      icon: '✨',
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`rounded-2xl p-4 border-2 ${style.bg} ${style.border} flex items-start gap-3 shadow-sm`}
    >
      <span className="text-2xl select-none">{style.icon}</span>
      <div className="flex-1">
        <p className={`font-body font-semibold ${style.text} text-base leading-relaxed`}>
          {message}
        </p>
      </div>
      {showSpeaker && onSpeak && (
        <button
          onClick={onSpeak}
          type="button"
          className="p-2 rounded-xl bg-white hover:bg-primary-100 text-primary-600 transition-colors shadow-sm"
          title="Escuchar a Matey"
        >
          🔊
        </button>
      )}
    </motion.div>
  );
};

export default MateyMessage;

