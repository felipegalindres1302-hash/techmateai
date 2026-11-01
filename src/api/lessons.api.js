import axiosClient from './axiosClient';

export const getLessons = (params = {}) => {
  return axiosClient.get('/lessons', { params });
};

export const getLessonById = (id) => {
  return axiosClient.get(`/lessons/${id}`);
};

export const getLessonExercises = (lessonId) => {
  return axiosClient.get(`/lessons/${lessonId}/exercises`);
};
