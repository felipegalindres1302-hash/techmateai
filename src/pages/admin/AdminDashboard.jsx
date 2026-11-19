import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminStats } from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, detail, tone = 'primary' }) => {
  const tones = {
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    secondary: 'bg-secondary-50 text-secondary-600 border-secondary-100',
    accent: 'bg-accent-50 text-accent-600 border-accent-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className={`rounded-3xl border-2 p-5 ${tones[tone] || tones.primary}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-3xl">{icon}</span>
        <span className="font-display text-3xl font-black">{value}</span>
      </div>
      <p className="mt-3 font-display text-sm font-bold">{label}</p>
      {detail && <p className="font-body text-xs opacity-80">{detail}</p>}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminStats();
        const payload = response.data.data || response.data;
        setStats(payload.stats || payload);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'No se pudieron cargar las estadísticas.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Cargando el panel..." />;
  }

  return (
    <div className="space-y-6">
      <section className="card border-none bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider">
              🛠️ Centro de contenidos
            </span>
            <h1 className="font-display text-3xl font-black sm:text-4xl">
              ¡Hola, {user?.name?.split(' ')[0] || 'Administrador'}!
            </h1>
            <p className="max-w-xl font-body text-sm text-slate-200">
              Gestiona lecciones, ejercicios, logros y la configuración global de
              TechMate AI desde un solo lugar.
            </p>
          </div>

          <Link
            to="/admin/lessons/new"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-display text-sm font-bold text-slate-900 transition-all hover:bg-primary-50"
          >
            + Nueva lección
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="📚"
          label="Lecciones"
          value={stats?.lessons?.total ?? 0}
          detail={`${stats?.lessons?.active ?? 0} publicadas`}
        />
        <StatCard
          icon="🧩"
          label="Ejercicios"
          value={stats?.exercises?.total ?? 0}
          detail={`${stats?.exercises?.active ?? 0} activos`}
          tone="secondary"
        />
        <StatCard
          icon="🏆"
          label="Logros"
          value={stats?.achievements?.total ?? 0}
          detail={`${stats?.achievements?.active ?? 0} disponibles`}
          tone="accent"
        />
        <StatCard
          icon="👨‍👩‍👧"
          label="Usuarios"
          value={stats?.users?.total ?? 0}
          detail={`${stats?.users?.parents ?? 0} padres · ${
            stats?.users?.children ?? 0
          } niños`}
          tone="slate"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-dark">
            Actividad de aprendizaje
          </h2>
          <p className="mt-1 font-body text-sm text-slate-500">
            Resumen de respuestas registradas por los niños.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-display text-2xl font-black text-slate-800">
                {stats?.progress?.total ?? 0}
              </p>
              <p className="font-body text-xs text-slate-500">
                Respuestas registradas
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="font-display text-2xl font-black text-emerald-700">
                {stats?.progress?.completed ?? 0}
              </p>
              <p className="font-body text-xs text-emerald-700">
                Ejercicios completados
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="font-display text-2xl font-black text-amber-700">
                {stats?.earnedAchievements ?? 0}
              </p>
              <p className="font-body text-xs text-amber-700">
                Logros conseguidos
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-primary-50">
          <h2 className="font-display text-xl font-bold text-dark">
            Accesos rápidos
          </h2>
          <div className="mt-4 space-y-2">
            <Link
              to="/admin/lessons"
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-display text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
            >
              Gestionar lecciones <span>→</span>
            </Link>
            <Link
              to="/admin/achievements"
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-display text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
            >
              Gestionar logros <span>→</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-display text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
            >
              Configuración global <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
