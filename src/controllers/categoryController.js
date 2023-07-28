/* eslint-disable no-shadow */
import { jsonInstance, regularInstance } from "helpers/axiosInstances";

export async function addNewCategory(data) {
  try {
    const result = await jsonInstance(localStorage.getItem("jwt")).post(
      "/category/add",
      data
    );
    return result;
  } catch (error) {
    return error?.response || error.message;
  }
}

export async function getCategories(controller) {
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).get(
      "/category/all",
      { signal: controller }
    );
    return result;
  } catch (error) {
    return error?.response || error.message;
  }
}

export async function deleteCategory(category) {
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).delete(
      `/category/delete/?category=${category}`
    );
    return result;
  } catch (error) {
    return error?.response || error.message;
  }
}

export async function updateCategory(category, updateCategory) {
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).put(
      `/category/update/?category=${category}&updateCategory=${updateCategory}`
    );
    return result;
  } catch (error) {
    return error?.response || error.message;
  }
}
