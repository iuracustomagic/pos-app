import { jsonInstance, regularInstance } from 'helpers/axiosInstances';

export async function addPayment(data) {
  try {
    const result = await jsonInstance(localStorage.getItem('jwt')).post('/payments/add', data);
    return result;
  } catch (error) {
    return error.response || 'Operation has been failed';
  }
}

export async function getCard(code) {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get(`/payments/discount?code=${code}`);
    return result;
  } catch (error) {
    return error.response || 'Can\'t apply discount';
  }
}

export async function getCheck(check, page) {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get(`/payments/transaction?check=${check}&page=${page}&total=true`);
    return result;
  } catch (error) {
    return error;
  }
}

export async function saveReturn(data) {
  try {
    const result = await jsonInstance(localStorage.getItem('jwt')).post('/payments/return', data);
    return result;
  } catch (error) {
    return error;
  }
}
