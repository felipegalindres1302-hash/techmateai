import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import MateyMessage from '../matey/MateyMessage';

const ExerciseCard = ({
  exerciseNumber = 1,
  totalExercises = 1,
  instruction = '',
  instructionEs = '',
  points = 10,
  onSubmit,
  isSubmitted = false,
  isLoading = false,
  result = null,
  onNext,
  onRetry,
  hints = [],
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-2xl mx-auto border-3 border-primary-200"
    >
      {/* Exercise header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-primary-100">
        <span className="font-display font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-xl text-sm border border-primary-200">
          Ejercicio {exerciseNumber} de {totalExercises}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-display font-bold text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full border border-accent-200">
            ⭐ {points} pts
          </span>
          {result && <StarRating stars={result.stars} size="sm" />}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-xl text-dark">
          {instructionEs || instruction}
        </h3>
        {instruction && instructionEs && (
          <p className="font-body text-sm text-gray-500 italic mt-0.5">
            "{instruction}"
          </p>
        )}
      </div>

      {/* Main interactive exercise content */}
      <div className="py-2 mb-6">{children}</div>

      {/* Hints if provided */}
      {hints && hints.length > 0 && !isSubmitted && (
        <div className="mb-4">
          <details className="text-xs font-body text-primary-700 bg-primary-50 p-3 rounded-2xl border border-primary-200 cursor-pointer">
            <summary className="font-display font-bold select-none">
              💡 ¿Necesitas una pista? Haz clic aquí
            </summary>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </details>
        </div>
      )}

      {/* Result feedback */}
      {isSubmitted && result && (
        <div className="mb-6 space-y-3">
          <MateyMessage
            message={result.feedback}
            type={result.isCorrect ? 'success' : 'error'}
          />

          {!result.isCorrect && result.correctAnswer && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-sm font-body">
              <span className="font-display font-bold text-amber-800">
                Respuesta correcta:{' '}
              </span>
              <span className="font-mono font-semibold text-dark">
                {Array.isArray(result.correctAnswer)
                  ? result.correctAnswer.join(', ')
                  : result.correctAnswer}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary-100">
        {!isSubmitted ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 text-base px-8 disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Comprobar 🚀'}
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            {!result?.isCorrect && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="bg-gray-100 hover:bg-gray-200 text-dark font-display font-semibold py-3 px-5 rounded-2xl transition-all text-sm"
              >
                🔄 Reintentar
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="btn-secondary ml-auto flex items-center gap-2 text-base px-8"
            >
              {exerciseNumber < totalExercises ? 'Siguiente ➡️' : 'Finalizar Lección 🎉'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ExerciseCard;

