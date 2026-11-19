import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createExercise,
  deleteExercise,
  getAdminLessonExercises,
  publishExercise,
  reorderExercises,
  updateExercise,
} from '../../api/admin.api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TYPE_OPTIONS = [
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

const typeMap = TYPE_OPTIONS.reduce((result, option) => {
  result[option.value] = option;
  return result;
}, {});

const createEmptyForm = (order = 1) => ({
  type: 'fill-blank',
  instruction: '',
  instructionEs: '',
  explanation: '',
  explanationEs: '',
  points: 10,
  order,
  isActive: true,
  hints: '',
  correctAnswer: '',
  correctAnswerIsArray: false,
  sentence: '',
  sentenceEs: '',
  blank: '',
  optionsText: '',
  phrase: '',
  context: '',
  wordsText: '',
  translationEs: '',
  audioText: '',
  text: '',
});

const splitList = (value) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const Field = ({ label, hint, children }) => (
  <label className="block space-y-1.5">
    <span className="font-display text-sm font-bold text-dark">{label}</span>
    {children}
    {hint && <span className="block font-body text-xs text-slate-500">{hint}</span>}
  </label>
);

const ContentSection = ({ title, children }) => (
  <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slate-600">
      {title}
    </h3>
    {children}
  </div>
);

const ContentFields = ({ form, updateField }) => {
  switch (form.type) {
    case 'fill-blank':
      return (
        <ContentSection title="Contenido para completar espacios">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Oración con el espacio">
              <input
                value={form.sentence}
                onChange={(event) =>
                  updateField('sentence', event.target.value)
                }
                className="input-field text-base"
                placeholder="I like ___ apples."
              />
            </Field>
            <Field label="Traducción de la oración">
              <input
                value={form.sentenceEs}
                onChange={(event) =>
                  updateField('sentenceEs', event.target.value)
                }
                className="input-field text-base"
                placeholder="Me gustan las ___."
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Palabra que falta">
              <input
                value={form.blank}
                onChange={(event) => updateField('blank', event.target.value)}
                className="input-field text-base"
                placeholder="red"
              />
            </Field>
            <Field label="Opciones" hint="Sepáralas con comas.">
              <input
                value={form.optionsText}
                onChange={(event) =>
                  updateField('optionsText', event.target.value)
                }
                className="input-field text-base"
                placeholder="red, blue, green"
              />
            </Field>
          </div>
        </ContentSection>
      );
    case 'translate':
      return (
        <ContentSection title="Contenido para traducir">
          <Field label="Frase a traducir">
            <input
              value={form.phrase}
              onChange={(event) => updateField('phrase', event.target.value)}
              className="input-field text-base"
              placeholder="The cat is sleeping."
            />
          </Field>
          <Field label="Contexto" hint="Opcional, ayuda a entender la frase.">
            <input
              value={form.context}
              onChange={(event) => updateField('context', event.target.value)}
              className="input-field text-base"
              placeholder="En una habitación"
            />
          </Field>
        </ContentSection>
      );
    case 'order-words':
      return (
        <ContentSection title="Contenido para ordenar palabras">
          <Field
            label="Palabras desordenadas"
            hint="Sepáralas con comas; se mezclarán en pantalla."
          >
            <input
              value={form.wordsText}
              onChange={(event) =>
                updateField('wordsText', event.target.value)
              }
              className="input-field text-base"
              placeholder="is, my, this, house"
            />
          </Field>
          <Field label="Traducción">
            <input
              value={form.translationEs}
              onChange={(event) =>
                updateField('translationEs', event.target.value)
              }
              className="input-field text-base"
              placeholder="Esta es mi casa"
            />
          </Field>
        </ContentSection>
      );
    case 'dictation':
      return (
        <ContentSection title="Contenido para dictado">
          <Field label="Texto que se dictará">
            <input
              value={form.audioText}
              onChange={(event) =>
                updateField('audioText', event.target.value)
              }
              className="input-field text-base"
              placeholder="The dog is running."
            />
          </Field>
          <Field label="Traducción">
            <input
              value={form.translationEs}
              onChange={(event) =>
                updateField('translationEs', event.target.value)
              }
              className="input-field text-base"
              placeholder="El perro está corriendo."
            />
          </Field>
        </ContentSection>
      );
    case 'listen-select':
      return (
        <ContentSection title="Contenido para escuchar y seleccionar">
          <Field label="Texto de audio">
            <input
              value={form.audioText}
              onChange={(event) =>
                updateField('audioText', event.target.value)
              }
              className="input-field text-base"
              placeholder="I have a blue backpack."
            />
          </Field>
          <Field label="Opciones" hint="Sepáralas con comas.">
            <input
              value={form.optionsText}
              onChange={(event) =>
                updateField('optionsText', event.target.value)
              }
              className="input-field text-base"
              placeholder="blue backpack, red hat, green shoes"
            />
          </Field>
        </ContentSection>
      );
    case 'listen-repeat':
      return (
        <ContentSection title="Contenido para escuchar y repetir">
          <Field label="Texto de audio">
            <input
              value={form.audioText}
              onChange={(event) =>
                updateField('audioText', event.target.value)
              }
              className="input-field text-base"
              placeholder="Hello, how are you?"
            />
          </Field>
        </ContentSection>
      );
    case 'phonics':
      return (
        <ContentSection title="Contenido de fonética">
          <Field label="Texto o sonido">
            <input
              value={form.text}
              onChange={(event) => updateField('text', event.target.value)}
              className="input-field text-base"
              placeholder="sh - ship"
            />
          </Field>
          <Field label="Traducción o pista">
            <input
              value={form.translationEs}
              onChange={(event) =>
                updateField('translationEs', event.target.value)
              }
              className="input-field text-base"
              placeholder="El sonido sh"
            />
          </Field>
        </ContentSection>
      );
    case 'song':
    case 'story':
    case 'mini-story':
      return (
        <ContentSection title="Contenido de lectura o canción">
          <Field label="Texto">
            <textarea
              value={form.text}
              onChange={(event) => updateField('text', event.target.value)}
              className="input-field min-h-[7rem] text-base"
              placeholder="Once upon a time..."
            />
          </Field>
          <Field label="Traducción o apoyo">
            <textarea
              value={form.translationEs}
              onChange={(event) =>
                updateField('translationEs', event.target.value)
              }
              className="input-field min-h-[5rem] text-base"
              placeholder="Había una vez..."
            />
          </Field>
        </ContentSection>
      );
    default:
      return null;
  }
};

const AdminExercises = () => {
  const { id: lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createEmptyForm());
  const [errors, setErrors] = useState([]);

  const loadData = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);

      try {
        const response = await getAdminLessonExercises(lessonId);
        const payload = response.data.data || response.data;
        setLesson(payload.lesson);
        setExercises(payload.exercises || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'No se pudieron cargar los ejercicios.'
        );
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [lessonId]
  );

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setErrors([]);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(createEmptyForm(exercises.length + 1));
    setErrors([]);
    setShowForm(true);
  };

  const handleEdit = (exercise) => {
    const content = exercise.content || {};
    setEditingId(exercise._id);
    setForm({
      type: exercise.type || 'fill-blank',
      instruction: exercise.instruction || '',
      instructionEs: exercise.instructionEs || '',
      explanation: exercise.explanation || '',
      explanationEs: exercise.explanationEs || '',
      points: exercise.points ?? 10,
      order: exercise.order ?? 1,
      isActive: exercise.isActive !== false,
      hints: (exercise.hints || []).join('\n'),
      correctAnswer: Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join(', ')
        : String(exercise.correctAnswer ?? ''),
      correctAnswerIsArray: Array.isArray(exercise.correctAnswer),
      sentence: content.sentence || '',
      sentenceEs: content.sentenceEs || '',
      blank: content.blank || '',
      optionsText: Array.isArray(content.options)
        ? content.options.join(', ')
        : '',
      phrase: content.phrase || '',
      context: content.context || '',
      wordsText: Array.isArray(content.words) ? content.words.join(', ') : '',
      translationEs: content.translationEs || '',
      audioText: content.audioText || '',
      text: content.text || content.lyrics || content.word || content.letter || '',
    });
    setErrors([]);
    setShowForm(true);
  };

  const buildPayload = () => {
    const content = {};

    switch (form.type) {
      case 'fill-blank':
        content.sentence = form.sentence.trim();
        if (form.sentenceEs.trim()) content.sentenceEs = form.sentenceEs.trim();
        if (form.blank.trim()) content.blank = form.blank.trim();
        if (splitList(form.optionsText).length > 0) {
          content.options = splitList(form.optionsText);
        }
        break;
      case 'translate':
        content.phrase = form.phrase.trim();
        if (form.context.trim()) content.context = form.context.trim();
        break;
      case 'order-words':
        content.words = splitList(form.wordsText);
        if (form.translationEs.trim()) {
          content.translationEs = form.translationEs.trim();
        }
        break;
      case 'dictation':
        content.audioText = form.audioText.trim();
        if (form.translationEs.trim()) {
          content.translationEs = form.translationEs.trim();
        }
        break;
      case 'listen-select':
        content.audioText = form.audioText.trim();
        content.options = splitList(form.optionsText);
        break;
      case 'listen-repeat':
        content.audioText = form.audioText.trim();
        break;
      case 'phonics':
      case 'song':
      case 'story':
      case 'mini-story':
        content.text = form.text.trim();
        if (form.translationEs.trim()) {
          content.translationEs = form.translationEs.trim();
        }
        break;
      default:
        break;
    }

    return {
      type: form.type,
      instruction: form.instruction.trim(),
      instructionEs: form.instructionEs.trim(),
      explanation: form.explanation.trim(),
      explanationEs: form.explanationEs.trim(),
      content,
      correctAnswer: form.correctAnswerIsArray
        ? splitList(form.correctAnswer)
        : form.correctAnswer.trim(),
      hints: form.hints
        .split('\n')
        .map((hint) => hint.trim())
        .filter(Boolean),
      points: Number(form.points) || 0,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    };
  };

  const validateForm = () => {
    const list = [];

    if (!form.instruction.trim()) {
      list.push('La instrucción en inglés es obligatoria.');
    }
    if (!form.instructionEs.trim()) {
      list.push('La instrucción en español es obligatoria.');
    }
    if (!form.correctAnswer.trim()) {
      list.push('La respuesta correcta es obligatoria.');
    }

    if (form.type === 'fill-blank' && !form.sentence.trim()) {
      list.push('La oración del ejercicio es obligatoria.');
    }
    if (form.type === 'translate' && !form.phrase.trim()) {
      list.push('La frase a traducir es obligatoria.');
    }
    if (form.type === 'order-words' && splitList(form.wordsText).length === 0) {
      list.push('Agrega al menos una palabra para ordenar.');
    }
    if (
      ['dictation', 'listen-repeat'].includes(form.type) &&
      !form.audioText.trim()
    ) {
      list.push('El texto de audio es obligatorio.');
    }
    if (form.type === 'listen-select') {
      if (!form.audioText.trim()) list.push('El texto de audio es obligatorio.');
      if (splitList(form.optionsText).length === 0) {
        list.push('Agrega al menos una opción.');
      }
    }
    if (
      ['phonics', 'song', 'story', 'mini-story'].includes(form.type) &&
      !form.text.trim()
    ) {
      list.push('El contenido de texto es obligatorio.');
    }

    return list;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors[0]);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateExercise(editingId, buildPayload());
        toast.success('Ejercicio actualizado.');
      } else {
        await createExercise(lessonId, buildPayload());
        toast.success('Ejercicio creado.');
      }
      resetForm();
      await loadData(false);
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setErrors(backendErrors);
      }
      toast.error(
        error.response?.data?.message || 'No se pudo guardar el ejercicio.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exercise) => {
    const confirmed = window.confirm(
      `¿Eliminar este ejercicio de tipo "${typeMap[exercise.type]?.label || exercise.type}"?`
    );
    if (!confirmed) return;

    try {
      await deleteExercise(exercise._id);
      toast.success('Ejercicio eliminado.');
      await loadData(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo eliminar el ejercicio.'
      );
    }
  };

  const handlePublish = async (exercise) => {
    try {
      await publishExercise(exercise._id, !exercise.isActive);
      toast.success(
        exercise.isActive ? 'Ejercicio ocultado.' : 'Ejercicio publicado.'
      );
      await loadData(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo cambiar el estado.'
      );
    }
  };

  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= exercises.length) return;

    const next = [...exercises];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await reorderExercises(
        lessonId,
        next.map((exercise, position) => ({
          id: exercise._id,
          order: position + 1,
        }))
      );
      await loadData(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'No se pudo reordenar.'
      );
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando ejercicios..." />;
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
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-secondary-600">
              Lección
            </p>
            <h1 className="font-display text-3xl font-black text-dark">
              {lesson?.titleEs || 'Ejercicios'}
            </h1>
            <p className="font-body text-sm text-slate-500">
              {lesson?.title} · {exercises.length} ejercicios
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="btn-secondary text-center text-sm"
          >
            + Nuevo ejercicio
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card space-y-5 border-primary-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-dark">
                {editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'}
              </h2>
              <p className="font-body text-sm text-slate-500">
                Configura el contenido según el tipo elegido.
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Tipo de ejercicio">
              <select
                value={form.type}
                onChange={(event) => updateField('type', event.target.value)}
                className="input-field text-base"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Puntos">
              <input
                type="number"
                min="0"
                value={form.points}
                onChange={(event) => updateField('points', event.target.value)}
                className="input-field text-base"
              />
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
            <Field
              label="Respuesta correcta"
              hint="Si hay varias respuestas válidas, sepáralas con comas."
            >
              <input
                value={form.correctAnswer}
                onChange={(event) =>
                  updateField('correctAnswer', event.target.value)
                }
                className="input-field text-base"
                placeholder="red"
              />
              <label className="flex items-center gap-2 pt-1 font-body text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={form.correctAnswerIsArray}
                  onChange={(event) =>
                    updateField('correctAnswerIsArray', event.target.checked)
                  }
                  className="h-4 w-4 accent-primary-500"
                />
                Guardar como lista de respuestas
              </label>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Instrucción en inglés">
              <input
                value={form.instruction}
                onChange={(event) =>
                  updateField('instruction', event.target.value)
                }
                className="input-field text-base"
                placeholder="Complete the sentence."
              />
            </Field>
            <Field label="Instrucción en español">
              <input
                value={form.instructionEs}
                onChange={(event) =>
                  updateField('instructionEs', event.target.value)
                }
                className="input-field text-base"
                placeholder="Completa la oración."
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Explicación en inglés" hint="Opcional.">
              <textarea
                value={form.explanation}
                onChange={(event) =>
                  updateField('explanation', event.target.value)
                }
                className="input-field min-h-[5rem] text-base"
              />
            </Field>
            <Field label="Explicación en español" hint="Opcional.">
              <textarea
                value={form.explanationEs}
                onChange={(event) =>
                  updateField('explanationEs', event.target.value)
                }
                className="input-field min-h-[5rem] text-base"
              />
            </Field>
          </div>

          <ContentFields form={form} updateField={updateField} />

          <Field label="Pistas" hint="Escribe una pista por línea.">
            <textarea
              value={form.hints}
              onChange={(event) => updateField('hints', event.target.value)}
              className="input-field min-h-[5rem] text-base"
              placeholder="Piensa en el color de una manzana."
            />
          </Field>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField('isActive', event.target.checked)
              }
              className="h-5 w-5 accent-primary-500"
            />
            <span>
              <span className="block font-display text-sm font-bold text-dark">
                Ejercicio activo
              </span>
              <span className="block font-body text-xs text-slate-500">
                Los ejercicios ocultos no se muestran a los niños.
              </span>
            </span>
          </label>

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
              className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Guardando...'
                : editingId
                  ? 'Guardar cambios'
                  : 'Crear ejercicio'}
            </button>
          </div>
        </form>
      )}

      {exercises.length === 0 ? (
        <div className="card border-dashed border-slate-300 text-center">
          <p className="text-5xl">🧩</p>
          <h2 className="mt-3 font-display text-xl font-bold text-dark">
            Esta lección aún no tiene ejercicios
          </h2>
          <p className="mt-1 font-body text-sm text-slate-500">
            Crea el primero para que los niños puedan practicar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const type = typeMap[exercise.type] || {
              icon: '🧩',
              label: exercise.type,
            };

            return (
              <article
                key={exercise._id}
                className="card border-slate-200 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-50 text-xl">
                      {type.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-display text-[10px] font-bold text-slate-500">
                          #{exercise.order}
                        </span>
                        <h2 className="font-display text-base font-bold text-dark">
                          {exercise.instructionEs}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide ${
                            exercise.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {exercise.isActive ? 'Activo' : 'Oculto'}
                        </span>
                      </div>
                      <p className="mt-0.5 font-body text-xs text-slate-500">
                        {type.label} · {exercise.points} puntos
                      </p>
                      <p className="mt-1 truncate font-body text-sm text-slate-600">
                        {exercise.instruction}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="rounded-xl border-2 border-slate-200 px-2.5 py-2 font-display text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Subir ejercicio"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === exercises.length - 1}
                      className="rounded-xl border-2 border-slate-200 px-2.5 py-2 font-display text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Bajar ejercicio"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(exercise)}
                      className="rounded-xl border-2 border-primary-200 bg-primary-50 px-3 py-2 font-display text-xs font-bold text-primary-700 transition-all hover:bg-primary-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePublish(exercise)}
                      className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-display text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                    >
                      {exercise.isActive ? 'Ocultar' : 'Publicar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(exercise)}
                      className="rounded-xl border-2 border-red-100 bg-red-50 px-3 py-2 font-display text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminExercises;
