import axiosClient from './axiosClient';

export const getAdminStats = () => axiosClient.get('/admin/stats');

export const getAdminLessons = (params = {}) =>
  axiosClient.get('/admin/lessons', { params });

export const getAdminLesson = (id) => axiosClient.get(`/admin/lessons/${id}`);

export const createLesson = (data) => axiosClient.post('/admin/lessons', data);

export const updateLesson = (id, data) =>
  axiosClient.patch(`/admin/lessons/${id}`, data);

export const deleteLesson = (id) =>
  axiosClient.delete(`/admin/lessons/${id}`);

export const publishLesson = (id, isActive) =>
  axiosClient.patch(`/admin/lessons/${id}/publish`, { isActive });

export const reorderLessons = (lessons) =>
  axiosClient.patch('/admin/lessons/reorder', { lessons });

export const getAdminLessonExercises = (lessonId) =>
  axiosClient.get(`/admin/lessons/${lessonId}/exercises`);

export const createExercise = (lessonId, data) =>
  axiosClient.post(`/admin/lessons/${lessonId}/exercises`, data);

export const updateExercise = (id, data) =>
  axiosClient.patch(`/admin/exercises/${id}`, data);

export const deleteExercise = (id) =>
  axiosClient.delete(`/admin/exercises/${id}`);

export const publishExercise = (id, isActive) =>
  axiosClient.patch(`/admin/exercises/${id}/publish`, { isActive });

export const reorderExercises = (lessonId, exercises) =>
  axiosClient.patch(`/admin/lessons/${lessonId}/exercises/reorder`, {
    exercises,
  });

export const getAdminAchievements = () =>
  axiosClient.get('/admin/achievements');

export const createAchievement = (data) =>
  axiosClient.post('/admin/achievements', data);

export const updateAchievement = (id, data) =>
  axiosClient.patch(`/admin/achievements/${id}`, data);

export const deleteAchievement = (id) =>
  axiosClient.delete(`/admin/achievements/${id}`);

export const publishAchievement = (id, isActive) =>
  axiosClient.patch(`/admin/achievements/${id}/publish`, { isActive });

export const getAdminSettings = () => axiosClient.get('/admin/settings');

export const updateAdminSettings = (data) =>
  axiosClient.patch('/admin/settings', data);

export const getPublicSettings = () => axiosClient.get('/settings');
