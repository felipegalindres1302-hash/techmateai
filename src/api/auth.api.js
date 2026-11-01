import axiosClient from './axiosClient';

export const register = (data) => {
  return axiosClient.post('/auth/register', data);
};

export const login = (data) => {
  return axiosClient.post('/auth/login', data);
};

export const createChild = (data) => {
  return axiosClient.post('/auth/children', data);
};

export const getMe = () => {
  return axiosClient.get('/auth/me');
};
