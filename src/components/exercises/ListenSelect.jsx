import { useState } from 'react';
import { motion } from 'framer-motion';
import { speakText } from '../../utils/helpers';

const ListenSelect = ({
  content = {},
  value = '',
  onChange,
  disabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioText = content.audioText || '';
  const options = content.options || [];

  const handlePlayAudio = async () => {
    if (!audioText || isPlaying) return;
    setIsPlaying(true);
    try {
      await speakText(audioText, 'en-US');
    } catch (err) {
      console.warn('Web Speech API fallback error:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio button */}
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-indigo-50 rounded-3xl border-2 border-primary-200">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handlePlayAudio}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 transition-all ${
            isPlaying
              ? 'bg-accent-400 border-accent-500 animate-pulse text-white'
              : 'bg-primary-500 border-primary-600 text-white hover:bg-primary-600'
          }`}
          title="Escuchar audio"
        >
          {isPlaying ? '🔊' : '🔈'}
        </motion.button>
        <p className="font-display font-semibold text-primary-700 text-sm mt-3">
          {isPlaying ? 'Matey está hablando...' : '¡Haz clic para escuchar!'}
        </p>
      </div>

      {/* Multiple choice options */}
      <div>
        <p className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
          Selecciona la opción correcta:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const isSelected = value === opt;
            return (
              <motion.button
                key={idx}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
                type="button"
                onClick={() => onChange(opt)}
                disabled={disabled}
                className={`p-4 rounded-2xl font-display font-bold text-left transition-all border-3 shadow-sm flex items-center gap-3 ${
                  isSelected
                    ? 'bg-primary-500 text-white border-primary-600 shadow-md scale-102'
                    : 'bg-white text-dark border-primary-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${
                    isSelected
                      ? 'bg-white text-primary-600'
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base flex-1">{opt}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListenSelect;
