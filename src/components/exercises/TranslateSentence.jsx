const TranslateSentence = ({
  content = {},
  value = '',
  onChange,
  disabled = false,
}) => {
  const phrase = content.phrase || '';
  const context = content.context || '';

  return (
    <div className="space-y-4">
      {/* Spanish prompt */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-primary-200 text-center">
        <span className="text-xs uppercase font-display font-bold text-primary-500 tracking-wider">
          Frase en español:
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-dark mt-1">
          "{phrase}"
        </h2>
        {context && (
          <p className="font-body text-xs text-gray-500 mt-2">
            💡 Contexto: {context}
          </p>
        )}
      </div>

      {/* English translation input */}
      <div>
        <label className="block text-sm font-display font-semibold text-dark mb-2">
          Escribe tu respuesta en inglés:
        </label>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Escribe en inglés aquí..."
          className="input-field rounded-2xl resize-none font-body text-lg"
          autoFocus
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {value.length} caracteres
        </div>
      </div>
    </div>
  );
};

export default TranslateSentence;

