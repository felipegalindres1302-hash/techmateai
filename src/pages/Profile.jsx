import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import LevelBadge from '../components/common/LevelBadge';
import StreakCounter from '../components/gamification/StreakCounter';
import Badge from '../components/common/Badge';
import MateyRobot from '../components/matey/MateyRobot';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const { summary, streak, achievements } = useProgress();

  const totalPoints = summary.totalPoints || user?.totalPoints || 0;
  const completedExercises = summary.totalCompleted || 0;

  return (
    <div className="page-container py-8 px-4 max-w-5xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-primary-200 p-8 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-primary-500 flex items-center justify-center text-5xl shadow-lg border-4 border-white text-white">
            🤖
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 text-xs shadow">
            ⭐
          </span>
        </div>

        <div className="text-center sm:text-left flex-1 space-y-2">
          <h1 className="font-display font-black text-3xl text-dark">
            {user?.name || 'Pequeño Aprendiz'}
          </h1>
          <p className="font-body text-sm text-gray-500">
            {user?.email ? user.email : 'Perfil de estudiante'} • Miembro desde{' '}
            {formatDate(user?.createdAt || new Date())}
          </p>

          <div className="flex flex-wrap gap-3 pt-2 justify-center sm:justify-start">
            <StreakCounter days={streak} size="sm" />
            <div className="bg-accent-100 text-accent-700 font-display font-bold px-4 py-1.5 rounded-2xl text-sm border border-accent-300">
              ⭐ {totalPoints} puntos acumulados
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <MateyRobot
            mood="happy"
            size="sm"
            message="¡Mira todo lo que has avanzado!"
          />
        </div>
      </motion.div>

      {/* Level & Progression */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <LevelBadge totalPoints={totalPoints} />
        </div>

        <div className="card p-6 flex flex-col justify-center items-center text-center">
          <span className="text-4xl mb-2">🎯</span>
          <h4 className="font-display font-bold text-dark text-lg">
            Ejercicios Superados
          </h4>
          <p className="font-display font-black text-4xl text-primary-600 my-1">
            {completedExercises}
          </p>
          <p className="text-xs font-body text-gray-500">
            ¡Sigue practicando para romper tu récord!
          </p>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          <h2 className="font-display font-bold text-2xl text-dark">
            Vitrina de Trofeos
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {achievements && achievements.length > 0 ? (
            achievements.map((ach) => (
              <Badge
                key={ach._id}
                icon={ach.icon}
                name={ach.nameEs || ach.name}
                description={ach.descriptionEs || ach.description}
                earned={ach.unlocked || ach.earned}
                rewardPoints={ach.rewardPoints}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-8">
              Cargando trofeos...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
