import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProgressSummary, getStreak } from '../api/progress.api';
import { getMyAchievements } from '../api/achievements.api';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe usarse dentro de un ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [summary, setSummary] = useState({
    totalExercises: 0,
    totalPoints: 0,
    level: 1,
    completionByCategory: {},
  });
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await getProgressSummary();
      const payload = response.data.data || response.data;
      setSummary(payload);
    } catch (error) {
      console.error('Error al obtener resumen de progreso:', error);
    }
  }, []);

  const fetchStreak = useCallback(async () => {
    try {
      const response = await getStreak();
      const payload = response.data.data || response.data;
      setStreak(payload.currentStreak ?? payload.streak ?? payload.days ?? 0);
    } catch (error) {
      console.error('Error al obtener racha:', error);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const response = await getMyAchievements();
      const payload = response.data.data || response.data;
      setAchievements(payload.achievements || payload || []);
    } catch (error) {
      console.error('Error al obtener logros:', error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    await Promise.all([fetchSummary(), fetchStreak(), fetchAchievements()]);
    setLoading(false);
  }, [isAuthenticated, fetchSummary, fetchStreak, fetchAchievements]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated, refreshAll]);

  const value = {
    summary,
    streak,
    achievements,
    loading,
    fetchSummary,
    fetchStreak,
    fetchAchievements,
    refreshAll,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export default ProgressContext;
