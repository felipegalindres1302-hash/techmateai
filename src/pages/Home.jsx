import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MateyRobot from '../components/matey/MateyRobot';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-container flex flex-col justify-between py-12 px-4 max-w-6xl mx-auto">
      {/* Hero section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 my-auto">
        {/* Left Column: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full font-display font-semibold text-sm">
            <span>✨</span> Tutor Virtual Inglés-Español para Niños
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-dark leading-tight">
            ¡Aprende inglés jugando con{' '}
            <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Matey!
            </span>{' '}
            🤖
          </h1>

          <p className="font-body text-lg sm:text-xl text-gray-600 max-w-xl">
            Un mini robot inteligente que te ayuda a escribir, escuchar y hablar
            inglés con actividades divertidas, estrellas y recompensas.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg py-4 px-8">
                Ir a Mi Aventura 🚀
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg py-4 px-8">
                  ¡Comenzar Gratis! 🌟
                </Link>
                <Link to="/login" className="btn-secondary text-lg py-4 px-8">
                  Ya tengo cuenta 🔑
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Right Column: Animated Matey */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative">
            {/* Glowing background halo */}
            <div className="absolute inset-0 bg-primary-300/30 rounded-full blur-3xl transform scale-125"></div>
            <MateyRobot
              mood="excited"
              size="lg"
              message="¡Hola! ¿Listo para aprender inglés jugando conmigo?"
            />
          </div>
        </motion.div>
      </div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
      >
        <div className="card text-center hover:-translate-y-2 transition-transform">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl">
            ✍️
          </div>
          <h3 className="font-display font-bold text-xl text-dark mb-2">
            Herramientas de Escritura
          </h3>
          <p className="font-body text-gray-600 text-sm">
            Completa oraciones, traduce palabras y ordena frases divertidas paso a paso.
          </p>
        </div>

        <div className="card text-center hover:-translate-y-2 transition-transform">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl">
            👂
          </div>
          <h3 className="font-display font-bold text-xl text-dark mb-2">
            Herramientas de Escucha
          </h3>
          <p className="font-body text-gray-600 text-sm">
            Escucha la voz de Matey, identifica sonidos, números, colores y canciones.
          </p>
        </div>

        <div className="card text-center hover:-translate-y-2 transition-transform">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl">
            🎮
          </div>
          <h3 className="font-display font-bold text-xl text-dark mb-2">
            Gamificación Divertida
          </h3>
          <p className="font-body text-gray-600 text-sm">
            Gana estrellas, sube de nivel, mantén tu racha de días y desbloquea medallas.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
