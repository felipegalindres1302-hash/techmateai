import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MateyRobot from '../components/matey/MateyRobot';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page-container flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Left: Matey welcoming back */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 text-center">
          <MateyRobot
            mood="happy"
            size="lg"
            message="¡Hola de nuevo! Ingresa tus datos para continuar practicando 🌟"
          />
        </div>

        {/* Right: Login Form */}
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="text-3xl">🔑</span>
            <h2 className="font-display font-extrabold text-2xl text-dark mt-2">
              Iniciar Sesión
            </h2>
            <p className="font-body text-gray-500 text-sm">
              Accede a tu cuenta de TechMate AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-display font-semibold text-dark mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-dark mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 text-lg mt-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Ingresando...' : '¡Entrar a Jugar! 🚀'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-primary-100 pt-4">
            <p className="font-body text-sm text-gray-600">
              ¿No tienes una cuenta aún?{' '}
              <Link
                to="/register"
                className="font-display font-bold text-primary-600 hover:text-primary-700 underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
