/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import constrants from 'assets/constrants';
const { BACKENDURL, SERVER_PORT } = constrants;

export const jsonInstance = (jwt) => axios.create({
  baseURL: `${BACKENDURL}:${SERVER_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest(data) {
    if (window.location.pathname === '/') return JSON.stringify(data);
    return JSON.stringify({ ...data, jwt });
  },
});

export const imgInstance = (jwt) => axios.create({
  baseURL: `${BACKENDURL}:${SERVER_PORT}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  params: {
    jwt,
  },
});

export const regularInstance = (jwt) => axios.create({
  baseURL: `${BACKENDURL}:${SERVER_PORT}`,
  params: {
    jwt,
  },
});
