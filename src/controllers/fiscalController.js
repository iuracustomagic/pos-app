import { regularInstance } from 'helpers/axiosInstances';

export async function report(type) {
  try {
    const result = regularInstance(localStorage.getItem('jwt')).get(`/fiscal/report/?type=${type}`);
    return result;
  } catch (error) {
    return error.response;
  }
}
