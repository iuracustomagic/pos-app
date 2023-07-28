import { jsonInstance, regularInstance } from 'helpers/axiosInstances';

export async function addCostumer(data) {
  try {
    const result = jsonInstance(localStorage.getItem('jwt')).post('/customer/add', data);
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getAllCustomers() {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get('/customer/all/');
    return result;
  } catch (error) {
    return error.response;
  }
}
