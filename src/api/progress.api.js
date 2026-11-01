import axiosClient from './axiosClient';

export const getProgressSummary = () => {
  return axiosClient.get('/progress/summary');
};

export const getStreak = () => {
  return axiosClient.get('/progress/streak');
};

export const getLessonProgress = (lessonId) => {
  return axiosClient.get(`/progress/lessons/${lessonId}`);
};
