import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MateyRobot from '../components/matey/MateyRobot';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);
    const result = await register({ name, email, password });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="page-container flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Left: Matey */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 text-center">
          <MateyRobot
            mood="excited"
            size="lg"
            message="¡Qué emoción! Creemos tu cuenta para comenzar la aventura juntos 🚀"
          />
        </div>

        {/* Right: Register Form */}
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-6">
            <span className="text-3xl">✨</span>
            <h2 className="font-display font-extrabold text-2xl text-dark mt-2">
              Crear Cuenta
            </h2>
            <p className="font-body text-gray-500 text-sm">
              Para padres y tutores de pequeños aprendices
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-display font-semibold text-dark mb-1">
                Nombre Completo o del Tutor
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="input-field"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-display font-semibold text-dark mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-secondary py-3.5 text-lg mt-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Registrando...' : '¡Crear Mi Cuenta! 🎉'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-primary-100 pt-4">
            <p className="font-body text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-display font-bold text-primary-600 hover:text-primary-700 underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
