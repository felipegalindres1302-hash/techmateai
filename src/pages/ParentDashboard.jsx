import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import MateyRobot from '../components/matey/MateyRobot';
import ProgressBar from '../components/common/ProgressBar';

const ParentDashboard = () => {
  const { user, createChild } = useAuth();
  const { summary } = useProgress();

  const [childName, setChildName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);

  const handleCreateChild = async (e) => {
    e.preventDefault();
    if (!childName.trim()) return;

    setIsCreating(true);
    await createChild({ name: childName });
    setIsCreating(false);
    setChildName('');
    setShowChildModal(false);
  };

  const writingProgress = summary.categoryProgress?.writing?.percentage || 0;
  const listeningProgress = summary.categoryProgress?.listening?.percentage || 0;

  return (
    <div className="page-container py-8 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3.5 py-1 rounded-full text-xs font-display font-bold uppercase mb-2">
            <span>👨‍👩‍👧</span> Panel Familiar
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-dark">
            Monitoreo de Aprendizaje
          </h1>
          <p className="font-body text-gray-600 text-base mt-1">
            Supervisa el avance de tus hijos en inglés con TechMate AI
          </p>
        </div>

        <button
          onClick={() => setShowChildModal(true)}
          className="btn-primary text-sm py-3 px-6 shadow-md"
        >
          ➕ Agregar Perfil de Niño
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card text-center p-6 bg-blue-50/60 border-primary-200">
          <span className="text-3xl mb-1 block">⭐</span>
          <h4 className="font-display font-bold text-dark text-base">
            Puntos Totales
          </h4>
          <p className="font-display font-extrabold text-3xl text-primary-600 my-1">
            {summary.totalPoints || 0}
          </p>
          <p className="text-xs text-gray-500 font-body">Acumulados en actividades</p>
        </div>

        <div className="card text-center p-6 bg-emerald-50/60 border-secondary-200">
          <span className="text-3xl mb-1 block">🎯</span>
          <h4 className="font-display font-bold text-dark text-base">
            Ejercicios Resueltos
          </h4>
          <p className="font-display font-extrabold text-3xl text-secondary-600 my-1">
            {summary.totalCompleted || 0}
          </p>
          <p className="text-xs text-gray-500 font-body">De {summary.totalExercises || 18} totales</p>
        </div>

        <div className="card text-center p-6 bg-amber-50/60 border-accent-200">
          <span className="text-3xl mb-1 block">🔥</span>
          <h4 className="font-display font-bold text-dark text-base">
            Racha Actual
          </h4>
          <p className="font-display font-extrabold text-3xl text-accent-600 my-1">
            {summary.currentStreak || 0} días
          </p>
          <p className="text-xs text-gray-500 font-body">Constancia de práctica</p>
        </div>
      </div>

      {/* Subject Mastery Comparison */}
      <div className="card p-6 space-y-6">
        <h3 className="font-display font-bold text-xl text-dark">
          Dominio por Área de Habilidad
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-display font-bold text-sm text-dark">
                ✍️ Escritura (Vocabulario, Gramática, Ortografía)
              </span>
              <span className="font-display font-bold text-sm text-primary-600">
                {writingProgress}%
              </span>
            </div>
            <ProgressBar progress={writingProgress} color="primary" height="h-3" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-display font-bold text-sm text-dark">
                👂 Escucha (Comprensión Auditiva, Pronunciación)
              </span>
              <span className="font-display font-bold text-sm text-secondary-600">
                {listeningProgress}%
              </span>
            </div>
            <ProgressBar progress={listeningProgress} color="secondary" height="h-3" />
          </div>
        </div>
      </div>

      {/* Matey's Pedagogy Note */}
      <div className="card bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-accent-200 p-6 flex flex-col sm:flex-row items-center gap-6">
        <MateyRobot
          mood="happy"
          size="sm"
          message="¡Los niños aprenden mejor con sesiones cortas de 10 a 15 minutos al día!"
        />
        <div className="flex-1 space-y-2">
          <h4 className="font-display font-bold text-lg text-dark">
            Consejo Pedagógico de Matey
          </h4>
          <p className="font-body text-sm text-gray-700 leading-relaxed">
            TechMate AI utiliza repetición espaciada y refuerzo positivo inmediato.
            Para obtener los mejores resultados, te recomendamos acompañar al niño
            en sus primeras sesiones y felicitarlo por cada medalla obtenida.
          </p>
        </div>
      </div>

      {/* Modal for adding a child */}
      {showChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-md w-full p-6 shadow-2xl"
          >
            <h3 className="font-display font-bold text-xl text-dark mb-4">
              Nuevo Perfil de Estudiante
            </h3>
            <form onSubmit={handleCreateChild} className="space-y-4">
              <div>
                <label className="block text-sm font-display font-semibold text-dark mb-1">
                  Nombre del niño(a)
                </label>
                <input
                  type="text"
                  required
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Ej. Mateo, Sofía..."
                  className="input-field"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChildModal(false)}
                  className="px-4 py-2 rounded-2xl font-body font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary text-sm py-2 px-6 disabled:opacity-50"
                >
                  {isCreating ? 'Guardando...' : 'Crear Perfil ✨'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
