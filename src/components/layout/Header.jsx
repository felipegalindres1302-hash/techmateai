import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { summary, streak } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🤖
            </motion.span>
            <span className="font-display font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              TechMate AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-body font-semibold text-dark hover:text-primary-500 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50"
                >
                  🏠 Inicio
                </Link>
                <Link
                  to="/lessons"
                  className="font-body font-semibold text-dark hover:text-primary-500 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50"
                >
                  📚 Lecciones
                </Link>
                <Link
                  to="/profile"
                  className="font-body font-semibold text-dark hover:text-primary-500 transition-colors px-3 py-2 rounded-xl hover:bg-primary-50"
                >
                  👤 Perfil
                </Link>

                {/* Stats */}
                <div className="flex items-center gap-3 bg-accent-50 rounded-2xl px-4 py-2 border-2 border-accent-200">
                  <span className="font-display font-bold text-accent-600">
                    ⭐ {summary.totalPoints || 0}
                  </span>
                  <span className="text-accent-300">|</span>
                  <span className="font-display font-bold text-error">
                    🔥 {streak || 0}
                  </span>
                </div>

                {/* User info + Logout */}
                <div className="flex items-center gap-3">
                  <span className="font-body font-semibold text-dark text-sm">
                    ¡Hola, {user?.name?.split(' ')[0]}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-error/10 text-error font-display font-semibold py-2 px-4 rounded-2xl hover:bg-error/20 transition-all text-sm"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary text-sm py-2 px-5">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-secondary text-sm py-2 px-5">
                  Crear Cuenta
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t-2 border-primary-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  {/* Mobile Stats */}
                  <div className="flex items-center justify-center gap-4 bg-accent-50 rounded-2xl px-4 py-3 border-2 border-accent-200">
                    <span className="font-display font-bold text-accent-600">
                      ⭐ {summary.totalPoints || 0}
                    </span>
                    <span className="font-display font-bold text-error">
                      🔥 {streak || 0}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body font-semibold text-dark hover:text-primary-500 transition-colors px-4 py-3 rounded-xl hover:bg-primary-50 text-lg"
                  >
                    🏠 Inicio
                  </Link>
                  <Link
                    to="/lessons"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body font-semibold text-dark hover:text-primary-500 transition-colors px-4 py-3 rounded-xl hover:bg-primary-50 text-lg"
                  >
                    📚 Lecciones
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block font-body font-semibold text-dark hover:text-primary-500 transition-colors px-4 py-3 rounded-xl hover:bg-primary-50 text-lg"
                  >
                    👤 Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-error/10 text-error font-display font-semibold py-3 px-4 rounded-2xl hover:bg-error/20 transition-all text-lg"
                  >
                    Salir 👋
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block btn-primary text-center text-lg"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block btn-secondary text-center text-lg"
                  >
                    Crear Cuenta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
