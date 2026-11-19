import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAdminSettings,
  updateAdminSettings,
} from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EXERCISE_TYPE_OPTIONS = [
  { value: 'fill-blank', label: 'Completar espacios', icon: '✏️' },
  { value: 'translate', label: 'Traducir', icon: '🔄' },
  { value: 'order-words', label: 'Ordenar palabras', icon: '🧩' },
  { value: 'dictation', label: 'Dictado', icon: '📝' },
  { value: 'listen-select', label: 'Escuchar y seleccionar', icon: '👂' },
  { value: 'listen-repeat', label: 'Escuchar y repetir', icon: '🎤' },
  { value: 'song', label: 'Canción', icon: '🎵' },
  { value: 'story', label: 'Historia', icon: '📖' },
  { value: 'phonics', label: 'Fonética', icon: '🔤' },
  { value: 'mini-story', label: 'Mini historia', icon: '📚' },
];

const FEATURE_FLAGS = [
  {
    key: 'aiChat',
    label: 'Chat con IA',
    description: 'Conversaciones guiadas con Matey.',
  },
  {
    key: 'microphone',
    label: 'Micrófono',
    description: 'Grabación de voz para practicar pronunciación.',
  },
  {
    key: 'weeklyReports',
    label: 'Reportes semanales',
    description: 'Resúmenes de progreso para padres.',
  },
];

const Field = ({ label, hint, children }) => (
  <label className="block space-y-1.5">
    <span className="font-display text-sm font-bold text-dark">{label}</span>
    {children}
    {hint && <span className="block font-body text-xs text-slate-500">{hint}</span>}
  </label>
);

const AdminSettings = () => {
  const [levels, setLevels] = useState([]);
  const [dailyGoals, setDailyGoals] = useState('');
  const [points, setPoints] = useState({});
  const [featureFlags, setFeatureFlags] = useState({
    aiChat: false,
    microphone: false,
    weeklyReports: false,
  });
  const [supportEmail, setSupportEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  const applySettings = (settings) => {
    setLevels(
      (settings.levels || []).map((level) => ({
        key: level.key || '',
        label: level.label || '',
        minPoints: level.minPoints ?? 0,
        emoji: level.emoji || '⭐',
      }))
    );
    setDailyGoals((settings.dailyGoals || []).join(', '));
    setPoints(settings.pointsByExerciseType || {});
    setFeatureFlags({
      aiChat: Boolean(settings.featureFlags?.aiChat),
      microphone: Boolean(settings.featureFlags?.microphone),
      weeklyReports: Boolean(settings.featureFlags?.weeklyReports),
    });
    setSupportEmail(settings.legal?.supportEmail || '');
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminSettings();
        const payload = response.data.data || response.data;
        applySettings(payload.settings || payload);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'No se pudo cargar la configuración.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateLevel = (index, field, value) => {
    setLevels((prev) =>
      prev.map((level, position) =>
        position === index ? { ...level, [field]: value } : level
      )
    );
  };

  const addLevel = () => {
    const lastMinPoints = levels.length
      ? Number(levels[levels.length - 1].minPoints) || 0
      : 0;

    setLevels((prev) => [
      ...prev,
      {
        key: `level_${prev.length + 1}`,
        label: '',
        minPoints: lastMinPoints + 100,
        emoji: '⭐',
      },
    ]);
  };

  const removeLevel = (index) => {
    setLevels((prev) => prev.filter((_, position) => position !== index));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setErrors([]);

    const parsedLevels = levels.map((level) => ({
      key: level.key.trim(),
      label: level.label.trim(),
      minPoints: Number(level.minPoints),
      emoji: level.emoji.trim() || '⭐',
    }));

    if (
      parsedLevels.length === 0 ||
      parsedLevels.some(
        (level) =>
          !level.key ||
          !level.label ||
          !Number.isFinite(level.minPoints) ||
          level.minPoints < 0
      )
    ) {
      toast.error('Cada nivel necesita clave, etiqueta y puntos válidos.');
      return;
    }

    const parsedGoals = dailyGoals
      .split(',')
      .map((goal) => Number(goal.trim()))
      .filter((goal) => Number.isFinite(goal) && goal > 0);

    if (parsedGoals.length === 0) {
      toast.error('Agrega al menos una meta diaria válida.');
      return;
    }

    const parsedPoints = {};
    EXERCISE_TYPE_OPTIONS.forEach((option) => {
      parsedPoints[option.value] = Number(points[option.value]) || 0;
    });

    setSaving(true);
    try {
      const response = await updateAdminSettings({
        levels: parsedLevels,
        dailyGoals: parsedGoals,
        pointsByExerciseType: parsedPoints,
        featureFlags,
        legal: { supportEmail: supportEmail.trim() },
      });
      const payload = response.data.data || response.data;
      if (payload.settings) applySettings(payload.settings);
      toast.success('Configuración guardada.');
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setErrors(backendErrors);
      }
      toast.error(
        error.response?.data?.message ||
          'No se pudo guardar la configuración.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando configuración..." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wider text-primary-600">
          Ajustes globales
        </p>
        <h1 className="font-display text-3xl font-black text-dark">
          Configuración
        </h1>
        <p className="font-body text-sm text-slate-500">
          Define niveles, metas diarias, puntos y funcionalidades de la app.
        </p>
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

      <form onSubmit={handleSave} className="space-y-5">
        <section className="card space-y-4 border-slate-200">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-dark">
                Niveles
              </h2>
              <p className="font-body text-sm text-slate-500">
                Los niveles se ordenan automáticamente por puntos mínimos.
              </p>
            </div>
            <button
              type="button"
              onClick={addLevel}
              className="rounded-xl border-2 border-primary-200 bg-primary-50 px-3 py-2 font-display text-xs font-bold text-primary-700 hover:bg-primary-100"
            >
              + Añadir nivel
            </button>
          </div>

          <div className="space-y-3">
            {levels.map((level, index) => (
              <div
                key={`${level.key}-${index}`}
                className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_1fr_140px_90px_auto]"
              >
                <input
                  value={level.key}
                  onChange={(event) =>
                    updateLevel(index, 'key', event.target.value)
                  }
                  className="input-field text-sm"
                  placeholder="clave"
                  aria-label={`Clave del nivel ${index + 1}`}
                />
                <input
                  value={level.label}
                  onChange={(event) =>
                    updateLevel(index, 'label', event.target.value)
                  }
                  className="input-field text-sm"
                  placeholder="Etiqueta"
                  aria-label={`Etiqueta del nivel ${index + 1}`}
                />
                <input
                  type="number"
                  min="0"
                  value={level.minPoints}
                  onChange={(event) =>
                    updateLevel(index, 'minPoints', event.target.value)
                  }
                  className="input-field text-sm"
                  aria-label={`Puntos mínimos del nivel ${index + 1}`}
                />
                <input
                  value={level.emoji}
                  onChange={(event) =>
                    updateLevel(index, 'emoji', event.target.value)
                  }
                  className="input-field text-center text-sm"
                  maxLength="8"
                  aria-label={`Emoji del nivel ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeLevel(index)}
                  className="rounded-xl border-2 border-red-100 bg-red-50 px-3 py-2 font-display text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="card space-y-4 border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-dark">
                Metas diarias
              </h2>
              <p className="font-body text-sm text-slate-500">
                Objetivos de ejercicios por día, separados por comas.
              </p>
            </div>
            <Field label="Metas">
              <input
                value={dailyGoals}
                onChange={(event) => setDailyGoals(event.target.value)}
                className="input-field text-base"
                placeholder="5, 10, 15"
              />
            </Field>
          </div>

          <div className="card space-y-4 border-slate-200">
            <div>
              <h2 className="font-display text-xl font-bold text-dark">
                Soporte
              </h2>
              <p className="font-body text-sm text-slate-500">
                Correo visible para padres y tutores.
              </p>
            </div>
            <Field label="Email de soporte">
              <input
                type="email"
                value={supportEmail}
                onChange={(event) => setSupportEmail(event.target.value)}
                className="input-field text-base"
                placeholder="soporte@techmate.ai"
              />
            </Field>
          </div>
        </section>

        <section className="card space-y-4 border-slate-200">
          <div>
            <h2 className="font-display text-xl font-bold text-dark">
              Puntos por tipo de ejercicio
            </h2>
            <p className="font-body text-sm text-slate-500">
              Se usan como valor por defecto al crear nuevos ejercicios.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {EXERCISE_TYPE_OPTIONS.map((option) => (
              <Field key={option.value} label={`${option.icon} ${option.label}`}>
                <input
                  type="number"
                  min="0"
                  value={points[option.value] ?? 0}
                  onChange={(event) =>
                    setPoints((prev) => ({
                      ...prev,
                      [option.value]: event.target.value,
                    }))
                  }
                  className="input-field text-base"
                />
              </Field>
            ))}
          </div>
        </section>

        <section className="card space-y-4 border-slate-200">
          <div>
            <h2 className="font-display text-xl font-bold text-dark">
              Funcionalidades
            </h2>
            <p className="font-body text-sm text-slate-500">
              Activa o desactiva módulos opcionales de la aplicación.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {FEATURE_FLAGS.map((feature) => (
              <label
                key={feature.key}
                className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4"
              >
                <input
                  type="checkbox"
                  checked={Boolean(featureFlags[feature.key])}
                  onChange={(event) =>
                    setFeatureFlags((prev) => ({
                      ...prev,
                      [feature.key]: event.target.checked,
                    }))
                  }
                  className="mt-0.5 h-5 w-5 accent-primary-500"
                />
                <span>
                  <span className="block font-display text-sm font-bold text-dark">
                    {feature.label}
                  </span>
                  <span className="block font-body text-xs text-slate-500">
                    {feature.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
