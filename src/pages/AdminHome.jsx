import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const modules = [
  {
    icon: '📚',
    title: 'Lecciones',
    description: 'Crea, edita, ordena y publica lecciones bilingües.',
  },
  {
    icon: '🧩',
    title: 'Ejercicios',
    description: 'Configura los distintos tipos de ejercicio y sus pistas.',
  },
  {
    icon: '🏆',
    title: 'Logros',
    description: 'Define medallas, condiciones y recompensas.',
  },
  {
    icon: '⚙️',
    title: 'Configuración',
    description: 'Ajusta niveles, puntos y catálogos de la aplicación.',
  },
];

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <div className="page-container py-8 px-4 max-w-6xl mx-auto space-y-8">
      <div className="card bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 border-none shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider">
              🛠️ Panel de administración
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl">
              ¡Hola, {user?.name?.split(' ')[0] || 'Administrador'}!
            </h1>
            <p className="font-body text-slate-200 max-w-xl">
              Desde aquí gestionarás el contenido y la configuración de
              TechMate AI. La administración de contenidos estará disponible en
              la siguiente fase.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="bg-white/10 hover:bg-white/20 text-white font-display font-semibold py-3 px-6 rounded-2xl transition-all text-sm border border-white/20"
          >
            Ver vista del niño 👀
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {modules.map((module) => (
          <div key={module.title} className="card flex items-start gap-4">
            <span className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl flex-shrink-0">
              {module.icon}
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-bold text-xl text-dark">
                  {module.title}
                </h2>
                <span className="text-[10px] font-display font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Próximamente
                </span>
              </div>
              <p className="font-body text-sm text-gray-600">
                {module.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-primary-50 border-primary-200">
        <h2 className="font-display font-bold text-xl text-dark mb-2">
          Fase 0 completada
        </h2>
        <p className="font-body text-sm text-gray-700">
          El backend ya cuenta con validación de variables de entorno, CORS
          restringido, cabeceras de seguridad, rate limiting, health check y
          corrección del farmeo de puntos.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;
