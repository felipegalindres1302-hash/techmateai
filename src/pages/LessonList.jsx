import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLessons } from '../api/lessons.api';
import MateyRobot from '../components/matey/MateyRobot';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LessonList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentDifficulty = searchParams.get('difficulty') || '';

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const params = {};
        if (currentCategory) params.category = currentCategory;
        if (currentDifficulty) params.difficulty = currentDifficulty;

        const res = await getLessons(params);
        const data = res.data.data?.lessons || res.data.lessons || [];
        setLessons(data);
      } catch (err) {
        console.error('Error fetching lessons list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [currentCategory, currentDifficulty]);

  const handleCategoryFilter = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleDifficultyFilter = (diff) => {
    const newParams = new URLSearchParams(searchParams);
    if (diff) {
      newParams.set('difficulty', diff);
    } else {
      newParams.delete('difficulty');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="page-container py-8 px-4 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3.5 py-1 rounded-full text-xs font-display font-bold uppercase mb-2">
            <span>📚</span> Catálogo de Lecciones
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-dark">
            {currentCategory === 'writing'
              ? '✍️ Misiones de Escritura'
              : currentCategory === 'listening'
              ? '👂 Misiones de Escucha'
              : '🌟 Todas las Lecciones'}
          </h1>
          <p className="font-body text-gray-600 text-base mt-1">
            Elige una lección para comenzar a practicar con Matey
          </p>
        </div>

        <MateyRobot
          mood="thinking"
          size="sm"
          message="¿Cuál quieres explorar hoy? 🤔"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl shadow-sm border border-primary-100">
        <span className="font-display font-bold text-xs uppercase text-gray-400 mr-2">
          Categoría:
        </span>
        <button
          onClick={() => handleCategoryFilter('')}
          className={`px-4 py-2 rounded-2xl text-sm font-display font-bold transition-all ${
            !currentCategory
              ? 'bg-primary-500 text-white shadow'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => handleCategoryFilter('writing')}
          className={`px-4 py-2 rounded-2xl text-sm font-display font-bold transition-all ${
            currentCategory === 'writing'
              ? 'bg-primary-500 text-white shadow'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          }`}
        >
          ✍️ Escritura
        </button>
        <button
          onClick={() => handleCategoryFilter('listening')}
          className={`px-4 py-2 rounded-2xl text-sm font-display font-bold transition-all ${
            currentCategory === 'listening'
              ? 'bg-secondary-500 text-white shadow'
              : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
          }`}
        >
          👂 Escucha
        </button>

        <span className="font-display font-bold text-xs uppercase text-gray-400 ml-auto mr-2">
          Dificultad:
        </span>
        <select
          value={currentDifficulty}
          onChange={(e) => handleDifficultyFilter(e.target.value)}
          className="bg-cloud border-2 border-primary-200 text-dark font-body text-sm font-semibold rounded-2xl px-3 py-1.5 outline-none focus:border-primary-500"
        >
          <option value="">Todas</option>
          <option value="beginner">Principiante 🌱</option>
          <option value="intermediate">Intermedio 🌿</option>
          <option value="advanced">Avanzado 🌳</option>
        </select>
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <LoadingSpinner text="Cargando las mejores lecciones..." />
      ) : lessons.length === 0 ? (
        <div className="card text-center py-16">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="font-display font-bold text-xl text-dark">
            No encontramos lecciones con estos filtros
          </h3>
          <p className="font-body text-gray-500 text-sm mt-1">
            Prueba seleccionando otra categoría o dificultad
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <motion.div
              key={lesson._id}
              whileHover={{ y: -6 }}
              className="card-game flex flex-col justify-between p-6 h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl shadow-sm">
                    {lesson.icon || '📚'}
                  </span>
                  <span
                    className={`text-xs font-display font-extrabold uppercase px-3 py-1 rounded-full ${
                      lesson.category === 'writing'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-secondary-100 text-secondary-700'
                    }`}
                  >
                    {lesson.category === 'writing' ? '✍️ Escritura' : '👂 Escucha'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-dark">
                  {lesson.titleEs}
                </h3>
                <p className="font-display font-semibold text-primary-600 text-sm mb-2">
                  {lesson.title}
                </p>

                <p className="font-body text-gray-600 text-sm leading-relaxed mb-4">
                  {lesson.descriptionEs || lesson.description}
                </p>
              </div>

              <div className="pt-4 border-t border-primary-100 flex items-center justify-between">
                <span className="text-xs font-body font-semibold text-gray-500 capitalize">
                  Nivel: {lesson.difficulty}
                </span>

                <Link
                  to={`/lessons/${lesson._id}`}
                  className={`${
                    lesson.category === 'writing' ? 'btn-primary' : 'btn-secondary'
                  } text-sm py-2 px-5 rounded-xl`}
                >
                  ¡Jugar Ahora! 🚀
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
