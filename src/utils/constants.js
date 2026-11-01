export const LEVELS = [
  { level: 1, label: 'Explorador', minPoints: 0, maxPoints: 99, emoji: '🌱' },
  { level: 2, label: 'Aventurero', minPoints: 100, maxPoints: 299, emoji: '🌿' },
  { level: 3, label: 'Descubridor', minPoints: 300, maxPoints: 599, emoji: '🌳' },
  { level: 4, label: 'Conquistador', minPoints: 600, maxPoints: 999, emoji: '⭐' },
  { level: 5, label: 'Maestro', minPoints: 1000, maxPoints: 1499, emoji: '🏆' },
  { level: 6, label: 'Leyenda', minPoints: 1500, maxPoints: 2499, emoji: '👑' },
  { level: 7, label: 'Genio', minPoints: 2500, maxPoints: Infinity, emoji: '🚀' },
];

export const EXERCISE_TYPES = {
  fill_blank: { name: 'Completar espacios', icon: '✏️' },
  translate: { name: 'Traducir', icon: '🔄' },
  order_words: { name: 'Ordenar palabras', icon: '🧩' },
  listen_select: { name: 'Escuchar y seleccionar', icon: '👂' },
  dictation: { name: 'Dictado', icon: '📝' },
};

export const CATEGORIES = {
  writing: { name: 'Escritura', icon: '✍️', color: 'primary' },
  listening: { name: 'Escucha', icon: '👂', color: 'secondary' },
};

export const MATEY_MESSAGES = {
  welcome: [
    '¡Hola! Soy Matey, tu compañero de aprendizaje 🤖',
    '¡Bienvenido de vuelta! ¿Listo para aprender? 🎉',
    '¡Qué bueno verte! Vamos a practicar inglés 🌟',
  ],
  correct: [
    '¡Excelente! ¡Lo hiciste genial! 🎉',
    '¡Muy bien! ¡Eres increíble! ⭐',
    '¡Perfecto! ¡Sigue así! 🌟',
    '¡Wow! ¡Eso estuvo fantástico! 🚀',
    '¡Brillante! ¡Cada vez aprendes más! 💪',
  ],
  incorrect: [
    '¡Casi! Inténtalo de nuevo, tú puedes 💪',
    'No te preocupes, aprender es practicar 🌱',
    '¡Buen intento! Vamos a intentarlo otra vez 🔄',
    '¡No pasa nada! Los errores nos hacen más fuertes 💫',
  ],
  hint: [
    '💡 ¡Te doy una pista!',
    '🤔 Piensa un momento...',
    '✨ ¡Aquí va una ayudita!',
  ],
  celebration: [
    '🎊 ¡Completaste la lección! ¡Eres una estrella!',
    '🏆 ¡Increíble! ¡Has terminado! ¡Celebremos!',
    '🎉 ¡Lo lograste! ¡Estoy muy orgulloso de ti!',
  ],
  thinking: [
    '🤔 Hmm, déjame pensar...',
    '🧠 Estoy procesando...',
    '💭 Un momento, estoy pensando...',
  ],
  idle: [
    '¡Vamos a aprender algo nuevo hoy! 📚',
    '¿Qué quieres practicar? 🎯',
    '¡El inglés es divertido! ¿Empezamos? 🌈',
  ],
  encouragement: [
    '¡Tú puedes! ¡Yo creo en ti! 💪',
    '¡Cada día aprendes algo nuevo! 🌟',
    '¡No te rindas, eres increíble! 🚀',
  ],
};
