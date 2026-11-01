import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderWords = ({
  content = {},
  onChange,
  disabled = false,
}) => {
  const initialWords = content.words || [];
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);

  useEffect(() => {
    // Shuffle words on exercise load
    const shuffled = [...initialWords]
      .map((word, i) => ({ id: `${word}-${i}`, word }))
      .sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
  }, [content]);

  // Click available word to select it
  const handleSelect = (item) => {
    if (disabled) return;
    const newSelected = [...selectedWords, item];
    const newAvailable = availableWords.filter((w) => w.id !== item.id);
    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    onChange(newSelected.map((w) => w.word).join(' '));
  };

  // Click selected word to deselect it
  const handleDeselect = (item) => {
    if (disabled) return;
    const newSelected = selectedWords.filter((w) => w.id !== item.id);
    const newAvailable = [...availableWords, item];
    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    onChange(newSelected.map((w) => w.word).join(' '));
  };

  return (
    <div className="space-y-6">
      {/* Translation clue */}
      {content.translationEs && (
        <div className="text-center bg-blue-50/70 p-3 rounded-2xl border border-primary-200">
          <p className="font-body text-sm text-gray-600">
            Significa:{' '}
            <span className="font-display font-bold text-dark">
              "{content.translationEs}"
            </span>
          </p>
        </div>
      )}

      {/* Target construction area */}
      <div className="min-h-[90px] p-4 bg-white rounded-3xl border-3 border-dashed border-primary-300 flex flex-wrap items-center gap-2 shadow-inner">
        {selectedWords.length === 0 ? (
          <p className="text-gray-400 font-body text-sm w-full text-center select-none">
            Toca las palabras de abajo para formar la oración aquí 👆
          </p>
        ) : (
          <AnimatePresence>
            {selectedWords.map((item) => (
              <motion.button
                key={item.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                type="button"
                onClick={() => handleDeselect(item)}
                disabled={disabled}
                className="bg-primary-500 hover:bg-primary-600 text-white font-display font-bold px-4 py-2.5 rounded-2xl shadow-md border-2 border-primary-600 transition-all text-base"
                title="Toca para quitar"
              >
                {item.word}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Available words bank */}
      <div>
        <p className="text-xs font-display font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
          Palabras disponibles:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {availableWords.map((item) => (
            <motion.button
              key={item.id}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              type="button"
              onClick={() => handleSelect(item)}
              disabled={disabled}
              className="bg-white hover:bg-primary-50 text-dark font-display font-bold px-4 py-2.5 rounded-2xl shadow-sm border-2 border-primary-200 hover:border-primary-400 transition-all text-base"
            >
              {item.word}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderWords;
