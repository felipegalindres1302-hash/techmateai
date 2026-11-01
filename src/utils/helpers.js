import { LEVELS } from './constants';

/**
 * Formatea una fecha a formato legible en español
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calcula las estrellas basadas en el puntaje
 * 0-49 = 1 estrella, 50-89 = 2 estrellas, 90-100 = 3 estrellas
 */
export const calculateStars = (score) => {
  if (score >= 90) return 3;
  if (score >= 50) return 2;
  if (score >= 0) return 1;
  return 0;
};

/**
 * Calcula el progreso del nivel actual basado en los puntos totales
 */
export const getLevelProgress = (totalPoints) => {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1] || null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalPoints >= LEVELS[i].minPoints) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
    }
  }

  let progress = 100;
  if (nextLevel) {
    const pointsInLevel = totalPoints - currentLevel.minPoints;
    const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints;
    progress = Math.min(Math.round((pointsInLevel / pointsNeeded) * 100), 100);
  }

  return {
    currentLevel,
    nextLevel,
    progress,
  };
};

/**
 * Usa la Web Speech API para pronunciar texto
 */
export const speakText = (text, lang = 'en-US') => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('La síntesis de voz no está disponible en este navegador'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith(lang.split('-')[0]) && v.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Obtiene un mensaje aleatorio de un array
 */
export const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};
