import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { getLessons } from '../api/lessons.api';
import MateyRobot from '../components/matey/MateyRobot';
import LevelBadge from '../components/common/LevelBadge';
import StreakCounter from '../components/gamification/StreakCounter';
import PointsDisplay from '../components/gamification/PointsDisplay';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';

const Dashboard = () => {
  const { user } = useAuth();
  const { summary, streak, achievements } = useProgress();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const res = await getLessons();
        const data = res.data.data?.lessons || res.data.lessons || [];
        setLessons(data);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchAllLessons();
  }, []);

  const writingLessons = lessons.filter((l) => l.category === 'writing');
  const listeningLessons = lessons.filter((l) => l.category === 'listening');

  const writingProgress = summary.categoryProgress?.writing?.percentage || 0;
  const listeningProgress = summary.categoryProgress?.listening?.percentage || 0;

  return (
    <div className="page-container py-8 px-4 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-blue-500 via-primary-500 to-indigo-600 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border-none">
        <div className="space-y-3 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider backdrop-blur-sm">
            <span>🚀</span> ¡Aventura de Aprendizaje!
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
            ¡Hola, {user?.name?.split(' ')[0] || 'Campeón'}!
          </h1>
          <p className="font-body text-blue-100 text-base sm:text-lg max-w-md">
            ¿Listo para ganar más estrellas hoy? Elige una misión de escritura o escucha.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 justify-center sm:justify-start">
            <StreakCounter days={streak} size="sm" />
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-1.5 font-display font-bold text-sm">
              ⭐ {summary.totalPoints || user?.totalPoints || 0} pts
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <MateyRobot
            mood="happy"
            size="sm"
            message="¡Estoy listo para ayudarte!"
          />
        </div>
      </div>

      {/* Level & Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <LevelBadge totalPoints={summary.totalPoints || user?.totalPoints || 0} />
        </div>
        <div className="card flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-amber-50 to-yellow-100 border-accent-300">
          <span className="text-4xl mb-2">🏆</span>
          <h4 className="font-display font-bold text-dark text-lg">
            Progreso General
          </h4>
          <p className="font-display font-extrabold text-3xl text-accent-700 my-1">
            {summary.overallPercentage || 0}%
          </p>
          <p className="text-xs font-body text-gray-600">
            {summary.totalCompleted || 0} de {summary.totalExercises || lessons.length * 3} ejercicios
          </p>
        </div>
      </div>

      {/* Main Sections: Writing & Listening */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WRITING SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✍️</span>
              <div>
                <h2 className="font-display font-bold text-2xl text-dark">
                  Escritura
                </h2>
                <p className="font-body text-xs text-gray-500">
                  Palabras, frases y oraciones en inglés
                </p>
              </div>
            </div>
            <Link
              to="/lessons?category=writing"
              className="text-xs font-display font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-200"
            >
              Ver todas ({writingLessons.length}) ➡️
            </Link>
          </div>

          <ProgressBar
            progress={writingProgress}
            label="Avance en escritura"
            color="primary"
          />

          <div className="space-y-3">
            {loadingLessons ? (
              <p className="text-sm font-body text-gray-400">Cargando lecciones...</p>
            ) : (
              writingLessons.slice(0, 3).map((lesson) => (
                <Link
                  key={lesson._id}
                  to={`/lessons/${lesson._id}`}
                  className="card-game flex items-center justify-between p-4 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-primary-100 group-hover:scale-110 transition-transform">
                      {lesson.icon || '✏️'}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-dark text-base group-hover:text-primary-600 transition-colors">
                        {lesson.titleEs}
                      </h4>
                      <p className="font-body text-xs text-gray-500">
                        {lesson.title} • {lesson.difficulty}
                      </p>
                    </div>
                  </div>
                  <span className="btn-primary text-xs py-2 px-4 rounded-xl">
                    Jugar ▶️
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* LISTENING SECTION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">👂</span>
              <div>
                <h2 className="font-display font-bold text-2xl text-dark">
                  Escucha
                </h2>
                <p className="font-body text-xs text-gray-500">
                  Entrena tu oído con la voz de Matey
                </p>
              </div>
            </div>
            <Link
              to="/lessons?category=listening"
              className="text-xs font-display font-bold text-secondary-600 hover:text-secondary-700 bg-secondary-50 px-3 py-1.5 rounded-xl border border-secondary-200"
            >
              Ver todas ({listeningLessons.length}) ➡️
            </Link>
          </div>

          <ProgressBar
            progress={listeningProgress}
            label="Avance en escucha"
            color="secondary"
          />

          <div className="space-y-3">
            {loadingLessons ? (
              <p className="text-sm font-body text-gray-400">Cargando lecciones...</p>
            ) : (
              listeningLessons.slice(0, 3).map((lesson) => (
                <Link
                  key={lesson._id}
                  to={`/lessons/${lesson._id}`}
                  className="card-game flex items-center justify-between p-4 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-secondary-100 group-hover:scale-110 transition-transform">
                      {lesson.icon || '🎧'}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-dark text-base group-hover:text-secondary-600 transition-colors">
                        {lesson.titleEs}
                      </h4>
                      <p className="font-body text-xs text-gray-500">
                        {lesson.title} • {lesson.difficulty}
                      </p>
                    </div>
                  </div>
                  <span className="btn-secondary text-xs py-2 px-4 rounded-xl">
                    Escuchar ▶️
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Achievements Showcase */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏅</span>
            <h2 className="font-display font-bold text-2xl text-dark">
              Mis Medallas y Logros
            </h2>
          </div>
          <Link
            to="/profile"
            className="text-xs font-display font-bold text-accent-700 bg-accent-50 px-3 py-1.5 rounded-xl border border-accent-200"
          >
            Ver vitrina completa 🏆
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements && achievements.length > 0 ? (
            achievements.slice(0, 4).map((ach) => (
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
            <div className="col-span-full card text-center py-8 text-gray-400">
              <span className="text-4xl block mb-2">🌟</span>
              <p className="font-display font-semibold">
                ¡Completa tus primeros ejercicios para ganar medallas!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

