import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createAchievement,
  deleteAchievement,
  getAdminAchievements,
  publishAchievement,
  updateAchievement,
} from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categoryLabels = {
  writing: '✍️ Escritura',
  listening: '👂 Escucha',
  streak: '🔥 Racha',
  general: '🌟 General',
};

const conditionLabels = {
  exercises_completed: 'Ejercicios completados',
  writing_completed: 'Ejercicios de escritura',
  listening_completed: 'Ejercicios de escucha',
  streak_days: 'Días consecutivos',
  total_points: 'Puntos totales',
  perfect_scores: 'Puntuaciones perfectas',
};

const emptyForm = {
  name: '',
  nameEs: '',
  description: '',
  descriptionEs: '',
  icon: '🏆',
  category: 'general',
  condition: 'exercises_completed',
  threshold: 1,
  rewardPoints: 50,
  isActive: true,
};

const Field = ({ label, hint, children }) => (
  <label className="block space-y-1.5">
    <span className="font-display text-sm font-bold text-dark">{label}</span>
    {children}
    {hint && <span className="block font-body text-xs text-slate-500">{hint}</span>}
  </label>
);

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);

  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const response = await getAdminAchievements();
      const payload = response.data.data || response.data;
      setAchievements(payload.achievements || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudieron cargar los logros.'
      );
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors([]);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors([]);
    setShowForm(true);
  };

  const handleEdit = (achievement) => {
    setEditingId(achievement._id);
    setForm({
      name: achievement.name || '',
      nameEs: achievement.nameEs || '',
      description: achievement.description || '',
      descriptionEs: achievement.descriptionEs || '',
      icon: achievement.icon || '🏆',
      category: achievement.category || 'general',
      condition: achievement.condition || 'exercises_completed',
      threshold: achievement.threshold ?? 1,
      rewardPoints: achievement.rewardPoints ?? 50,
      isActive: achievement.isActive !== false,
    });
    setErrors([]);
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (
      !form.name.trim() ||
      !form.nameEs.trim() ||
      !form.description.trim() ||
      !form.descriptionEs.trim()
    ) {
      toast.error('Completa los nombres y las descripciones.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      nameEs: form.nameEs.trim(),
      description: form.description.trim(),
      descriptionEs: form.descriptionEs.trim(),
      icon: form.icon.trim() || '🏆',
      category: form.category,
      condition: form.condition,
      threshold: Number(form.threshold) || 0,
      rewardPoints: Number(form.rewardPoints) || 0,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateAchievement(editingId, payload);
        toast.success('Logro actualizado.');
      } else {
        await createAchievement(payload);
        toast.success('Logro creado.');
      }
      resetForm();
      await loadData(false);
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setErrors(backendErrors);
      }
      toast.error(
        error.response?.data?.message || 'No se pudo guardar el logro.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (achievement) => {
    const confirmed = window.confirm(
      `¿Eliminar el logro "${achievement.nameEs}"? También se borrarán los registros obtenidos por los niños.`
    );
    if (!confirmed) return;

    try {
      await deleteAchievement(achievement._id);
      toast.success('Logro eliminado.');
      await loadData(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo eliminar el logro.'
      );
    }
  };

  const handlePublish = async (achievement) => {
    try {
      await publishAchievement(achievement._id, !achievement.isActive);
      toast.success(
        achievement.isActive ? 'Logro ocultado.' : 'Logro publicado.'
      );
      await loadData(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo cambiar el estado.'
      );
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando logros..." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-wider text-accent-600">
            Gamificación
          </p>
          <h1 className="font-display text-3xl font-black text-dark">Logros</h1>
          <p className="font-body text-sm text-slate-500">
            Define medallas, condiciones y recompensas para los niños.
          </p>
        </div>
        <button type="button" onClick={handleNew} className="btn-accent text-sm">
          + Nuevo logro
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card space-y-5 border-accent-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-dark">
                {editingId ? 'Editar logro' : 'Nuevo logro'}
              </h2>
              <p className="font-body text-sm text-slate-500">
                La condición indica cuándo se desbloquea.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border-2 border-slate-200 px-3 py-2 font-display text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>

          {errors.length > 0 && (
            <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-4">
              <p className="font-display text-sm font-bold text-red-700">
                Revisa estos campos:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 font-body text-sm text-red-600">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Nombre en inglés">
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="input-field text-base"
                placeholder="First Steps"
              />
            </Field>
            <Field label="Nombre en español">
              <input
                value={form.nameEs}
                onChange={(event) => updateField('nameEs', event.target.value)}
                className="input-field text-base"
                placeholder="Primeros pasos"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Descripción en inglés">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                className="input-field min-h-[5rem] text-base"
                placeholder="Complete your first exercise."
              />
            </Field>
            <Field label="Descripción en español">
              <textarea
                value={form.descriptionEs}
                onChange={(event) =>
                  updateField('descriptionEs', event.target.value)
                }
                className="input-field min-h-[5rem] text-base"
                placeholder="Completa tu primer ejercicio."
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Icono" hint="Usa un emoji.">
              <input
                value={form.icon}
                onChange={(event) => updateField('icon', event.target.value)}
                className="input-field text-base"
                maxLength="8"
              />
            </Field>
            <Field label="Categoría">
              <select
                value={form.category}
                onChange={(event) =>
                  updateField('category', event.target.value)
                }
                className="input-field text-base"
              >
                <option value="general">General</option>
                <option value="writing">Escritura</option>
                <option value="listening">Escucha</option>
                <option value="streak">Racha</option>
              </select>
            </Field>
            <Field label="Condición">
              <select
                value={form.condition}
                onChange={(event) =>
                  updateField('condition', event.target.value)
                }
                className="input-field text-base"
              >
                {Object.entries(conditionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Umbral" hint="Cantidad necesaria para desbloquear.">
              <input
                type="number"
                min="0"
                value={form.threshold}
                onChange={(event) =>
                  updateField('threshold', event.target.value)
                }
                className="input-field text-base"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Puntos de recompensa">
              <input
                type="number"
                min="0"
                value={form.rewardPoints}
                onChange={(event) =>
                  updateField('rewardPoints', event.target.value)
                }
                className="input-field text-base"
              />
            </Field>
            <label className="flex items-center gap-3 self-end rounded-2xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  updateField('isActive', event.target.checked)
                }
                className="h-5 w-5 accent-accent-500"
              />
              <span>
                <span className="block font-display text-sm font-bold text-dark">
                  Logro activo
                </span>
                <span className="block font-body text-xs text-slate-500">
                  Los logros ocultos no se pueden desbloquear.
                </span>
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border-2 border-slate-200 px-6 py-3 font-display text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-accent text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Guardando...'
                : editingId
                  ? 'Guardar cambios'
                  : 'Crear logro'}
            </button>
          </div>
        </form>
      )}

      {achievements.length === 0 ? (
        <div className="card border-dashed border-slate-300 text-center">
          <p className="text-5xl">🏆</p>
          <h2 className="mt-3 font-display text-xl font-bold text-dark">
            No hay logros
          </h2>
          <p className="mt-1 font-body text-sm text-slate-500">
            Crea el primero para motivar a los niños.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <article key={achievement._id} className="card border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-3xl">
                  {achievement.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-dark">
                      {achievement.nameEs}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide ${
                        achievement.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {achievement.isActive ? 'Activo' : 'Oculto'}
                    </span>
                  </div>
                  <p className="font-body text-xs text-slate-500">
                    {achievement.name}
                  </p>
                  <p className="mt-1 font-body text-sm text-slate-600">
                    {achievement.descriptionEs}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-slate-500">
                    <span className="rounded-full bg-accent-50 px-2 py-1">
                      {categoryLabels[achievement.category] ||
                        achievement.category}
                    </span>
                    <span className="rounded-full bg-primary-50 px-2 py-1">
                      {conditionLabels[achievement.condition] ||
                        achievement.condition}{' '}
                      ≥ {achievement.threshold}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      ⭐ +{achievement.rewardPoints} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(achievement)}
                  className="rounded-xl border-2 border-primary-200 bg-primary-50 px-3 py-2 font-display text-xs font-bold text-primary-700 transition-all hover:bg-primary-100"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish(achievement)}
                  className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-display text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                >
                  {achievement.isActive ? 'Ocultar' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(achievement)}
                  className="rounded-xl border-2 border-red-100 bg-red-50 px-3 py-2 font-display text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAchievements;
