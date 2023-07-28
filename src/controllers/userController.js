import { jsonInstance, regularInstance } from 'helpers/axiosInstances';

export async function login(data) {
  try {
    const result = await jsonInstance(localStorage.getItem('jwt')).post('users/login', data);
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function logout() {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get('users/logout/');
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function register(data) {
  try {
    const result = await jsonInstance(localStorage.getItem('jwt')).post('users/register', data);
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function update(data) {
  try {
    const result = await jsonInstance(localStorage.getItem('jwt')).post('users/post', data);
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getUserById(_id) {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get(`users/user/?_id=${_id}`);
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getAllUsers() {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).get('users/all/');
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function deleteUserById(id) {
  try {
    const result = await regularInstance(localStorage.getItem('jwt')).delete(`users/user/?id=${id}`);
    return result;
  } catch (error) {
    return error.respone;
  }
}
