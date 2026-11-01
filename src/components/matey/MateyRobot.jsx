import { motion } from 'framer-motion';

const MateyRobot = ({
  mood = 'idle',
  message = '',
  size = 'md',
  onClick,
}) => {
  const sizeMap = {
    sm: { width: 120, height: 140, bubbleText: 'text-sm' },
    md: { width: 180, height: 210, bubbleText: 'text-base' },
    lg: { width: 240, height: 280, bubbleText: 'text-lg' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Eye shapes depending on mood
  const renderEyes = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return (
          <>
            {/* Happy curved eyes ^ ^ */}
            <path d="M 32 46 Q 38 38 44 46" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 56 46 Q 62 38 68 46" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Blush cheeks */}
            <circle cx="28" cy="50" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="72" cy="50" r="5" fill="#FDA4AF" opacity="0.8" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Looking up / dot eyes */}
            <circle cx="38" cy="40" r="4.5" fill="#1E293B" />
            <circle cx="62" cy="40" r="4.5" fill="#1E293B" />
            <ellipse cx="50" cy="53" rx="4" ry="2" fill="#1E293B" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downturned eyes */}
            <path d="M 32 44 Q 38 50 44 44" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 56 44 Q 62 50 68 44" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 44 54 Q 50 50 56 54" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Big star/sparkle eyes */}
            <circle cx="38" cy="44" r="6" fill="#1E293B" />
            <circle cx="62" cy="44" r="6" fill="#1E293B" />
            <circle cx="40" cy="42" r="2" fill="#FFFFFF" />
            <circle cx="64" cy="42" r="2" fill="#FFFFFF" />
            {/* Big open smile */}
            <path d="M 40 50 Q 50 60 60 50 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            {/* Big round friendly eyes with shine */}
            <circle cx="38" cy="44" r="5.5" fill="#1E293B" />
            <circle cx="62" cy="44" r="5.5" fill="#1E293B" />
            <circle cx="40" cy="42" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="42" r="1.8" fill="#FFFFFF" />
            {/* Gentle smile */}
            <path d="M 42 51 Q 50 57 58 51" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  // Motion variants for robot body
  const robotVariants = {
    idle: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    celebrating: {
      y: [0, -18, 0, -18, 0],
      rotate: [0, -6, 6, -6, 0],
      transition: { duration: 1.2, repeat: Infinity },
    },
    thinking: {
      rotate: [0, -5, -5, 0],
      y: [0, -4, 0],
      transition: { duration: 2, repeat: Infinity },
    },
    excited: {
      scale: [1, 1.06, 1],
      y: [0, -12, 0],
      transition: { duration: 0.8, repeat: Infinity },
    },
    sad: {
      y: [0, 4, 0],
      transition: { duration: 3, repeat: Infinity },
    },
  };

  return (
    <div
      className="flex flex-col items-center select-none cursor-pointer group"
      onClick={onClick}
    >
      {/* Speech bubble if message provided */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mb-3 max-w-xs bg-white rounded-2xl p-4 shadow-lg border-2 border-primary-200 text-center"
        >
          <p className={`font-display font-semibold text-dark ${currentSize.bubbleText}`}>
            {message}
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white drop-shadow-sm"></div>
        </motion.div>
      )}

      {/* Robot SVG */}
      <motion.div
        variants={robotVariants}
        animate={mood}
        style={{ width: currentSize.width, height: currentSize.height }}
        className="filter drop-shadow-lg"
      >
        <svg
          viewBox="0 0 100 120"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <rect x="47.5" y="6" width="5" height="12" rx="2.5" fill="#3B82F6" />
          <circle cx="50" cy="6" r="6" fill="#F59E0B" />
          <circle cx="50" cy="6" r="3" fill="#FDE68A" />

          {/* Ears / Side audio knobs */}
          <rect x="14" y="38" width="6" height="16" rx="3" fill="#10B981" />
          <rect x="80" y="38" width="6" height="16" rx="3" fill="#10B981" />

          {/* Head */}
          <rect
            x="20"
            y="18"
            width="60"
            height="48"
            rx="16"
            fill="#3B82F6"
            stroke="#1D4ED8"
            strokeWidth="3"
          />

          {/* Head Screen / Face Plate */}
          <rect
            x="26"
            y="26"
            width="48"
            height="32"
            rx="10"
            fill="#E0F2FE"
            stroke="#93C5FD"
            strokeWidth="2"
          />

          {/* Eyes & Mouth per mood */}
          {renderEyes()}

          {/* Neck */}
          <rect x="42" y="66" width="16" height="8" rx="3" fill="#64748B" />

          {/* Body */}
          <rect
            x="24"
            y="74"
            width="52"
            height="36"
            rx="12"
            fill="#3B82F6"
            stroke="#1D4ED8"
            strokeWidth="3"
          />

          {/* Chest Screen with Heart / Star */}
          <rect
            x="34"
            y="81"
            width="32"
            height="22"
            rx="6"
            fill="#FFFFFF"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          <text
            x="50"
            y="96"
            textAnchor="middle"
            fontSize="12"
            fill="#EF4444"
          >
            {mood === 'celebrating' ? '⭐' : '❤️'}
          </text>

          {/* Left Arm */}
          <path
            d="M 24 82 Q 12 90 14 100"
            stroke="#3B82F6"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="14" cy="100" r="4.5" fill="#10B981" />

          {/* Right Arm */}
          {mood === 'celebrating' ? (
            // Arm waving up
            <path
              d="M 76 82 Q 88 70 86 60"
              stroke="#3B82F6"
              strokeWidth="7"
              strokeLinecap="round"
            />
          ) : (
            // Arm resting
            <path
              d="M 76 82 Q 88 90 86 100"
              stroke="#3B82F6"
              strokeWidth="7"
              strokeLinecap="round"
            />
          )}
          <circle
            cx={mood === 'celebrating' ? 86 : 86}
            cy={mood === 'celebrating' ? 60 : 100}
            r="4.5"
            fill="#10B981"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default MateyRobot;
