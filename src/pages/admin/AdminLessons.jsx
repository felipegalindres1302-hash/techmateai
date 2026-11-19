import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  deleteLesson,
  getAdminLessons,
  publishLesson,
} from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categoryLabels = {
  writing: '✍️ Escritura',
  listening: '👂 Escucha',
};

const difficultyLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const AdminLessons = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search.trim()) params.search = filters.search.trim();
        if (filters.category) params.category = filters.category;
        if (filters.difficulty) params.difficulty = filters.difficulty;

        const response = await getAdminLessons(params);
        const payload = response.data.data || response.data;
        if (active) setLessons(payload.lessons || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'No se pudieron cargar las lecciones.'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [filters]);

  const reload = async () => {
    const params = {};
    if (filters.search.trim()) params.search = filters.search.trim();
    if (filters.category) params.category = filters.category;
    if (filters.difficulty) params.difficulty = filters.difficulty;

    const response = await getAdminLessons(params);
    const payload = response.data.data || response.data;
    setLessons(payload.lessons || []);
  };

  const handlePublish = async (lesson) => {
    try {
      await publishLesson(lesson._id, !lesson.isActive);
      toast.success(
        lesson.isActive ? 'Lección ocultada.' : 'Lección publicada.'
      );
      await reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo cambiar el estado.'
      );
    }
  };

  const handleDelete = async (lesson) => {
    const confirmed = window.confirm(
      `¿Eliminar "${lesson.titleEs}"? También se borrarán sus ejercicios y el progreso asociado.`
    );
    if (!confirmed) return;

    try {
      await deleteLesson(lesson._id);
      toast.success('Lección eliminada.');
      await reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo eliminar la lección.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-wider text-primary-600">
            Contenidos
          </p>
          <h1 className="font-display text-3xl font-black text-dark">
            Lecciones
          </h1>
          <p className="font-body text-sm text-slate-500">
            Crea, ordena y publica las lecciones de escritura y escucha.
          </p>
        </div>
        <Link to="/admin/lessons/new" className="btn-primary text-center text-sm">
          + Nueva lección
        </Link>
      </div>

      <div className="card grid grid-cols-1 gap-3 border-slate-200 md:grid-cols-3">
        <input
          type="search"
          value={filters.search}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value }))
          }
          placeholder="Buscar por título o descripción..."
          className="input-field text-base"
        />
        <select
          value={filters.category}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, category: event.target.value }))
          }
          className="input-field text-base"
        >
          <option value="">Todas las categorías</option>
          <option value="writing">Escritura</option>
          <option value="listening">Escucha</option>
        </select>
        <select
          value={filters.difficulty}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, difficulty: event.target.value }))
          }
          className="input-field text-base"
        >
          <option value="">Todas las dificultades</option>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner text="Cargando lecciones..." />
      ) : lessons.length === 0 ? (
        <div className="card border-dashed border-slate-300 text-center">
          <p className="text-5xl">📭</p>
          <h2 className="mt-3 font-display text-xl font-bold text-dark">
            No hay lecciones
          </h2>
          <p className="mt-1 font-body text-sm text-slate-500">
            Crea la primera lección o cambia los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <article
              key={lesson._id}
              className="card border-slate-200 p-4 transition-all hover:border-primary-300"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-2xl">
                    {lesson.icon || '📚'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold text-dark">
                        {lesson.titleEs}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide ${
                          lesson.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {lesson.isActive ? 'Publicada' : 'Oculta'}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-body text-xs text-slate-500">
                      {lesson.title}
                    </p>
                    <p className="mt-1 line-clamp-2 font-body text-sm text-slate-600">
                      {lesson.descriptionEs}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-slate-500">
                      <span className="rounded-full bg-primary-50 px-2 py-1">
                        {categoryLabels[lesson.category] || lesson.category}
                      </span>
                      <span className="rounded-full bg-secondary-50 px-2 py-1">
                        {difficultyLabels[lesson.difficulty] ||
                          lesson.difficulty}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        Orden {lesson.order}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        {lesson.activeExerciseCount}/{lesson.exerciseCount}{' '}
                        ejercicios
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        ⏱️ {lesson.estimatedMinutes || 10} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/lessons/${lesson._id}/edit`)
                    }
                    className="rounded-xl border-2 border-primary-200 bg-primary-50 px-3 py-2 font-display text-xs font-bold text-primary-700 transition-all hover:bg-primary-100"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/lessons/${lesson._id}/exercises`)
                    }
                    className="rounded-xl border-2 border-secondary-200 bg-secondary-50 px-3 py-2 font-display text-xs font-bold text-secondary-600 transition-all hover:bg-secondary-100"
                  >
                    Ejercicios ({lesson.exerciseCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePublish(lesson)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-display text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    {lesson.isActive ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(lesson)}
                    className="rounded-xl border-2 border-red-100 bg-red-50 px-3 py-2 font-display text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLessons;
