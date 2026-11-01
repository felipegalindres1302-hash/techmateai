import { useState } from 'react';
import { motion } from 'framer-motion';
import { speakText } from '../../utils/helpers';

const Dictation = ({
  content = {},
  value = '',
  onChange,
  disabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioText = content.audioText || '';

  const handlePlayAudio = async () => {
    if (!audioText || isPlaying) return;
    setIsPlaying(true);
    try {
      await speakText(audioText, 'en-US');
    } catch (err) {
      console.warn('Web Speech API error:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Speaker play card */}
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-50 to-indigo-50 rounded-3xl border-2 border-indigo-200">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handlePlayAudio}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 transition-all ${
            isPlaying
              ? 'bg-purple-500 border-purple-600 animate-pulse text-white'
              : 'bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600'
          }`}
          title="Escuchar audio"
        >
          {isPlaying ? '🔊' : '🎧'}
        </motion.button>
        <p className="font-display font-semibold text-indigo-700 text-sm mt-3">
          {isPlaying ? 'Escuchando a Matey...' : 'Toca para escuchar la frase en inglés'}
        </p>

        {content.translationEs && (
          <p className="font-body text-xs text-gray-500 mt-2">
            Pista en español: "{content.translationEs}"
          </p>
        )}
      </div>

      {/* Text area for writing what was heard */}
      <div>
        <label className="block text-sm font-display font-semibold text-dark mb-2">
          Escribe exactamente lo que escuchaste en inglés:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Escribe lo que oíste aquí..."
          className="input-field rounded-2xl text-lg font-body"
          autoComplete="off"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Dictation;

