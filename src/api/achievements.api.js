import axiosClient from './axiosClient';

export const getAchievements = () => {
  return axiosClient.get('/achievements');
};

export const getMyAchievements = () => {
  return axiosClient.get('/achievements/me');
};
