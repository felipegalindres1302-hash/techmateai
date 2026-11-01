import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonExercises } from '../api/lessons.api';
import useExercise from '../hooks/useExercise';
import { useProgress } from '../context/ProgressContext';

// Matey components
import MateyRobot from '../components/matey/MateyRobot';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import AchievementPopup from '../components/gamification/AchievementPopup';

// Exercise types
import FillBlank from '../components/exercises/FillBlank';
import TranslateSentence from '../components/exercises/TranslateSentence';
import OrderWords from '../components/exercises/OrderWords';
import ListenSelect from '../components/exercises/ListenSelect';
import Dictation from '../components/exercises/Dictation';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshAll } = useProgress();

  const [lessonInfo, setLessonInfo] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedPointsTotal, setEarnedPointsTotal] = useState(0);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  // Matey state
  const [mateyMood, setMateyMood] = useState('idle');
  const [mateyMessage, setMateyMessage] = useState('¡Tú puedes hacerlo! 🌟');

  const {
    currentAnswer,
    setAnswer,
    submitAnswer,
    isSubmitted,
    result,
    isLoading: isSubmitting,
    nextExercise: resetExerciseHook,
  } = useExercise();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await getLessonExercises(id);
        const payload = res.data.data || res.data;
        setLessonInfo(payload.lesson || {});
        setExercises(payload.exercises || []);
      } catch (err) {
        console.error('Error fetching lesson exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [id]);

  const currentExercise = exercises[currentIndex];
  const progressPercent = exercises.length > 0
    ? Math.round((currentIndex / exercises.length) * 100)
    : 0;

  // Handle submit
  const handleSubmit = async () => {
    if (!currentAnswer || !currentExercise) return;
    setMateyMood('thinking');
    setMateyMessage('Revisando tu respuesta...');

    const res = await submitAnswer(currentExercise._id);
    if (res) {
      if (res.isCorrect) {
        setMateyMood('celebrating');
        setMateyMessage(res.feedback || '¡Excelente trabajo! 🎉');
        setEarnedPointsTotal((prev) => prev + res.points);
      } else {
        setMateyMood('sad');
        setMateyMessage(res.feedback || '¡Casi! Inténtalo de nuevo 💪');
      }

      if (res.newAchievements && res.newAchievements.length > 0) {
        setUnlockedAchievement(res.newAchievements[0]);
      }
    }
  };

  // Move to next exercise or complete lesson
  const handleNext = () => {
    resetExerciseHook();
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setMateyMood('idle');
      setMateyMessage('¡Siguiente desafío! ¿Listo? 🚀');
    } else {
      setIsCompleted(true);
      setMateyMood('celebrating');
      setMateyMessage('¡CONSEGUIDO! ¡Completaste toda la lección! 🏆');
      refreshAll();
    }
  };

  const handleRetry = () => {
    resetExerciseHook();
    setMateyMood('idle');
    setMateyMessage('¡Vamos otra vez, tú puedes lograrlo! 💪');
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <LoadingSpinner text="Preparando tus ejercicios..." />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">📭</span>
        <h2 className="font-display font-bold text-2xl text-dark">
          Esta lección aún no tiene ejercicios disponibles
        </h2>
        <Link to="/lessons" className="btn-primary mt-6">
          Volver a Lecciones 📚
        </Link>
      </div>
    );
  }

  // Final celebration screen
  if (isCompleted) {
    return (
      <div className="page-container py-12 px-4 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-8 sm:p-12 border-4 border-accent-300 shadow-2xl relative overflow-hidden"
        >
          <div className="text-6xl mb-4 animate-bounce">🎉</div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-dark mb-2">
            ¡Felicidades, Campeón!
          </h1>
          <p className="font-body text-gray-600 text-lg mb-6">
            Completaste la lección:{' '}
            <span className="font-display font-bold text-primary-600">
              {lessonInfo?.titleEs || lessonInfo?.title}
            </span>
          </p>

          <div className="flex justify-center my-6">
            <MateyRobot
              mood="celebrating"
              size="md"
              message="¡Eres una superestrella del inglés!"
            />
          </div>

          <div className="bg-accent-50 rounded-2xl p-6 border-2 border-accent-200 my-6 inline-flex flex-col items-center">
            <span className="text-xs uppercase font-display font-bold text-accent-700">
              Puntos Ganados en esta Misión
            </span>
            <span className="font-display font-black text-4xl text-accent-600 my-1">
              ⭐ +{earnedPointsTotal} pts
            </span>
            <StarRating stars={3} size="md" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/dashboard" className="btn-primary text-base py-3 px-8">
              Ir al Inicio 🏠
            </Link>
            <Link to="/lessons" className="btn-secondary text-base py-3 px-8">
              Otra Lección 📚
            </Link>
          </div>
        </motion.div>

        {unlockedAchievement && (
          <AchievementPopup
            achievement={unlockedAchievement}
            onClose={() => setUnlockedAchievement(null)}
          />
        )}
      </div>
    );
  }

  // Render dynamic exercise content
  const renderExerciseContent = () => {
    switch (currentExercise.type) {
      case 'fill-blank':
        return (
          <FillBlank
            content={currentExercise.content}
            value={currentAnswer}
            onChange={setAnswer}
            disabled={isSubmitted}
          />
        );
      case 'translate':
        return (
          <TranslateSentence
            content={currentExercise.content}
            value={currentAnswer}
            onChange={setAnswer}
            disabled={isSubmitted}
          />
        );
      case 'order-words':
        return (
          <OrderWords
            content={currentExercise.content}
            onChange={setAnswer}
            disabled={isSubmitted}
          />
        );
      case 'listen-select':
        return (
          <ListenSelect
            content={currentExercise.content}
            value={currentAnswer}
            onChange={setAnswer}
            disabled={isSubmitted}
          />
        );
      case 'dictation':
        return (
          <Dictation
            content={currentExercise.content}
            value={currentAnswer}
            onChange={setAnswer}
            disabled={isSubmitted}
          />
        );
      default:
        return (
          <div className="text-center p-4">
            <p className="font-body text-gray-500">
              Tipo de ejercicio: {currentExercise.type}
            </p>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input-field mt-3"
              placeholder="Escribe tu respuesta..."
              disabled={isSubmitted}
            />
          </div>
        );
    }
  };

  return (
    <div className="page-container py-8 px-4 max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Navigation & Progress */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/lessons"
          className="text-xs font-display font-bold text-gray-500 hover:text-primary-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200"
        >
          ⬅️ Salir de la lección
        </Link>
        <div className="flex-1 max-w-md">
          <ProgressBar
            progress={progressPercent}
            label={`Progreso de la lección`}
            color="primary"
            height="h-3"
          />
        </div>
      </div>

      {/* Main Exercise Layout: Robot companion + Exercise Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Robot Companion */}
        <div className="hidden lg:flex flex-col items-center sticky top-24">
          <MateyRobot
            mood={mateyMood}
            size="md"
            message={mateyMessage}
          />
        </div>

        {/* Right Column: Exercise Card */}
        <div className="lg:col-span-3">
          <ExerciseCard
            exerciseNumber={currentIndex + 1}
            totalExercises={exercises.length}
            instruction={currentExercise.instruction}
            instructionEs={currentExercise.instructionEs}
            points={currentExercise.points}
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
            isLoading={isSubmitting}
            result={result}
            onNext={handleNext}
            onRetry={handleRetry}
            hints={currentExercise.hints}
          >
            {renderExerciseContent()}
          </ExerciseCard>
        </div>
      </div>

      {/* Achievement modal if unlocked */}
      {unlockedAchievement && (
        <AchievementPopup
          achievement={unlockedAchievement}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}
    </div>
  );
};

export default LessonView;

