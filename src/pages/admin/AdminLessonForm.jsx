import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createLesson,
  getAdminLesson,
  getAdminLessons,
  updateLesson,
} from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const emptyForm = {
  title: '',
  titleEs: '',
  description: '',
  descriptionEs: '',
  category: 'writing',
  difficulty: 'beginner',
  order: 1,
  icon: '📚',
  estimatedMinutes: 10,
  objectives: '',
  tags: '',
  isActive: true,
};

const Field = ({ label, hint, children }) => (
  <label className="block space-y-1.5">
    <span className="font-display text-sm font-bold text-dark">{label}</span>
    {children}
    {hint && <span className="block font-body text-xs text-slate-500">{hint}</span>}
  </label>
);

const AdminLessonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!isEditing) {
      let active = true;

      const loadDefaultOrder = async () => {
        try {
          const response = await getAdminLessons();
          const payload = response.data.data || response.data;
          const lessons = payload.lessons || [];
          const maxOrder = lessons.reduce(
            (max, lesson) => Math.max(max, Number(lesson.order) || 0),
            0
          );
          if (active) {
            setForm((prev) => ({ ...prev, order: maxOrder + 1 }));
          }
        } catch {
          // Si falla, se mantiene el orden por defecto.
        }
      };

      loadDefaultOrder();
      return () => {
        active = false;
      };
    }

    const load = async () => {
      try {
        const response = await getAdminLesson(id);
        const payload = response.data.data || response.data;
        const lesson = payload.lesson;

        setForm({
          title: lesson.title || '',
          titleEs: lesson.titleEs || '',
          description: lesson.description || '',
          descriptionEs: lesson.descriptionEs || '',
          category: lesson.category || 'writing',
          difficulty: lesson.difficulty || 'beginner',
          order: lesson.order ?? 1,
          icon: lesson.icon || '📚',
          estimatedMinutes: lesson.estimatedMinutes ?? 10,
          objectives: (lesson.objectives || []).join('\n'),
          tags: (lesson.tags || []).join(', '),
          isActive: lesson.isActive !== false,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'No se pudo cargar la lección.'
        );
        navigate('/admin/lessons');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEditing, navigate]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (!form.title.trim() || !form.titleEs.trim()) {
      toast.error('El título en inglés y español son obligatorios.');
      return;
    }

    if (!form.description.trim() || !form.descriptionEs.trim()) {
      toast.error('Las descripciones son obligatorias.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      titleEs: form.titleEs.trim(),
      description: form.description.trim(),
      descriptionEs: form.descriptionEs.trim(),
      category: form.category,
      difficulty: form.difficulty,
      order: Number(form.order) || 0,
      icon: form.icon.trim() || '📚',
      estimatedMinutes: Number(form.estimatedMinutes) || 0,
      objectives: form.objectives
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await updateLesson(id, payload);
        toast.success('Lección actualizada.');
      } else {
        await createLesson(payload);
        toast.success('Lección creada.');
      }
      navigate('/admin/lessons');
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setErrors(validationErrors);
      }
      toast.error(
        error.response?.data?.message || 'No se pudo guardar la lección.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando lección..." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/admin/lessons"
          className="font-display text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          ← Volver a lecciones
        </Link>
        <h1 className="mt-2 font-display text-3xl font-black text-dark">
          {isEditing ? 'Editar lección' : 'Nueva lección'}
        </h1>
        <p className="font-body text-sm text-slate-500">
          Completa la información bilingüe y el orden de la lección.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 border-slate-200">
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
          <Field label="Título en inglés">
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="input-field text-base"
              placeholder="My first words"
            />
          </Field>
          <Field label="Título en español">
            <input
              value={form.titleEs}
              onChange={(event) => updateField('titleEs', event.target.value)}
              className="input-field text-base"
              placeholder="Mis primeras palabras"
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
              className="input-field min-h-[6rem] text-base"
              placeholder="Learn basic English words."
            />
          </Field>
          <Field label="Descripción en español">
            <textarea
              value={form.descriptionEs}
              onChange={(event) =>
                updateField('descriptionEs', event.target.value)
              }
              className="input-field min-h-[6rem] text-base"
              placeholder="Aprende palabras básicas en inglés."
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Categoría">
            <select
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="input-field text-base"
            >
              <option value="writing">Escritura</option>
              <option value="listening">Escucha</option>
            </select>
          </Field>
          <Field label="Dificultad">
            <select
              value={form.difficulty}
              onChange={(event) =>
                updateField('difficulty', event.target.value)
              }
              className="input-field text-base"
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </Field>
          <Field label="Orden" hint="Menor número aparece primero.">
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(event) => updateField('order', event.target.value)}
              className="input-field text-base"
            />
          </Field>
          <Field label="Duración (min)">
            <input
              type="number"
              min="0"
              value={form.estimatedMinutes}
              onChange={(event) =>
                updateField('estimatedMinutes', event.target.value)
              }
              className="input-field text-base"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Icono" hint="Usa un emoji, por ejemplo 📚.">
            <input
              value={form.icon}
              onChange={(event) => updateField('icon', event.target.value)}
              className="input-field text-base"
              maxLength="8"
            />
          </Field>
          <Field label="Etiquetas" hint="Sepáralas con comas.">
            <input
              value={form.tags}
              onChange={(event) => updateField('tags', event.target.value)}
              className="input-field text-base"
              placeholder="vocabulario, animales"
            />
          </Field>
        </div>

        <Field
          label="Objetivos"
          hint="Escribe un objetivo por línea. Se mostrarán en la lección."
        >
          <textarea
            value={form.objectives}
            onChange={(event) => updateField('objectives', event.target.value)}
            className="input-field min-h-[6rem] text-base"
            placeholder="Reconocer palabras básicas&#10;Practicar la pronunciación"
          />
        </Field>

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => updateField('isActive', event.target.checked)}
            className="h-5 w-5 accent-primary-500"
          />
          <span>
            <span className="block font-display text-sm font-bold text-dark">
              Lección publicada
            </span>
            <span className="block font-body text-xs text-slate-500">
              Las lecciones ocultas no aparecen para los niños.
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Link
            to="/admin/lessons"
            className="rounded-2xl border-2 border-slate-200 px-6 py-3 text-center font-display text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Guardando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear lección'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLessonForm;
