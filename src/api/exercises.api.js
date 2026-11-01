import axiosClient from './axiosClient';

export const submitAnswer = (exerciseId, answer, timeSpent = 0) => {
  return axiosClient.post(`/exercises/${exerciseId}/submit`, {
    userAnswer: answer,
    answer,
    timeSpent,
  });
};
