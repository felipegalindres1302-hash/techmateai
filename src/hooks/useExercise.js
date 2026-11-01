import { useState, useCallback } from 'react';
import { submitAnswer as submitAnswerApi } from '../api/exercises.api';
import { calculateStars } from '../utils/helpers';

const useExercise = () => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const setAnswer = useCallback((answer) => {
    setCurrentAnswer(answer);
  }, []);

  const submitAnswer = useCallback(async (exerciseId) => {
    if (!currentAnswer || isLoading) return null;

    setIsLoading(true);
    try {
      const response = await submitAnswerApi(exerciseId, currentAnswer);
      const data = response.data.data || response.data;
      const resultData = {
        isCorrect: data.isCorrect ?? data.correct ?? false,
        correctAnswer: data.correctAnswer || data.answer || '',
        points: data.pointsAwarded || data.points || 0,
        stars: calculateStars(data.score || (data.isCorrect || data.correct ? 100 : 0)),
        feedback: data.mateyMessage || data.feedback || '',
        score: data.score || 0,
        newAchievements: data.newAchievements || [],
      };

      setResult(resultData);
      setIsSubmitted(true);
      setAttempts((prev) => prev + 1);
      return resultData;
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      const errorResult = {
        isCorrect: false,
        correctAnswer: '',
        points: 0,
        stars: 0,
        feedback: 'Ocurrió un error al enviar tu respuesta. Inténtalo de nuevo.',
        score: 0,
      };
      setResult(errorResult);
      setIsSubmitted(true);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [currentAnswer, isLoading]);

  const nextExercise = useCallback(() => {
    setCurrentAnswer('');
    setIsSubmitted(false);
    setResult(null);
  }, []);

  const resetExercise = useCallback(() => {
    setCurrentAnswer('');
    setIsSubmitted(false);
    setResult(null);
    setAttempts(0);
  }, []);

  return {
    currentAnswer,
    isSubmitted,
    result,
    isLoading,
    attempts,
    setAnswer,
    submitAnswer,
    nextExercise,
    resetExercise,
  };
};

export default useExercise;
