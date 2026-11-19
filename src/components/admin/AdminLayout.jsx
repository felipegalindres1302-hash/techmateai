import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Resumen', icon: '📊', end: true },
  { to: '/admin/lessons', label: 'Lecciones', icon: '📚' },
  { to: '/admin/achievements', label: 'Logros', icon: '🏆' },
  { to: '/admin/settings', label: 'Configuración', icon: '⚙️' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
        <aside className="card h-fit border-slate-200 p-5 lg:sticky lg:top-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
              🛠️
            </div>
            <div>
              <p className="font-display text-lg font-black leading-tight text-dark">
                TechMate AI
              </p>
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-slate-500">
                Panel admin
              </p>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-2 lg:flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-display text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
            <div>
              <p className="font-display text-sm font-bold text-dark">
                {user?.name || 'Administrador'}
              </p>
              <p className="font-body text-xs text-slate-500">{user?.email}</p>
            </div>
            <Link
              to="/dashboard"
              className="block rounded-2xl bg-primary-50 px-4 py-2 text-center font-display text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
            >
              Ir a la app →
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border-2 border-slate-200 px-4 py-2 font-display text-sm font-semibold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="mt-6 min-w-0 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
