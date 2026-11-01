const FillBlank = ({
  content = {},
  value = '',
  onChange,
  disabled = false,
}) => {
  const sentence = content.sentence || 'The ___ is delicious.';
  const parts = sentence.split('___');
  const options = content.options || [];

  return (
    <div className="space-y-6">
      {/* Sentence with input / blank in the middle */}
      <div className="bg-primary-50/70 p-6 rounded-3xl border-2 border-primary-200 text-center">
        <p className="font-display text-2xl text-dark leading-loose flex flex-wrap items-center justify-center gap-2">
          <span>{parts[0]}</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="palabra aquí"
            className="input-field max-w-[200px] text-center font-bold text-primary-600 bg-white shadow-inner border-primary-400 py-1.5 px-3 rounded-xl"
            autoComplete="off"
            autoFocus
          />
          {parts[1] && <span>{parts[1]}</span>}
        </p>

        {content.sentenceEs && (
          <p className="font-body text-sm text-gray-500 mt-3">
            Español: "{content.sentenceEs}"
          </p>
        )}
      </div>

      {/* Option chips if options are provided */}
      {options.length > 0 && !disabled && (
        <div>
          <p className="text-xs font-display font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
            Toca una opción para autocompletar:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(opt)}
                className={`py-2 px-4 rounded-2xl font-display font-bold text-base transition-all border-2 shadow-sm ${
                  value.toLowerCase() === opt.toLowerCase()
                    ? 'bg-primary-500 text-white border-primary-600 scale-105'
                    : 'bg-white text-primary-700 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillBlank;

