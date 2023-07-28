/* eslint-disable import/prefer-default-export */
import {
  jsonInstance,
  imgInstance,
  regularInstance
} from "helpers/axiosInstances";

export async function addProduct(data, img) {
  try {
    const result = await jsonInstance(localStorage.getItem("jwt")).post(
      "products/add",
      data
    );

    if (img) {
      const image = new FormData();
      image.append("image", img);
      await imgInstance(localStorage.getItem("jwt")).post(
        "products/img/",
        image
      );
    }
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getProducts(state, filter, total, unwind) {

  const filterValue = JSON.stringify(filter ? {name: filter} : {} )
  console.log(filterValue)
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).get(
      `/products/?state=${state}&filter=${filterValue}&total=${
        total || false
      }${unwind ? "&unwind=false" : ""}`
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function getProductByFilter(filter) {
  const filterValue = JSON.stringify(filter ? {barcode: filter} : {} )
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).get(
      `/product/?filter=${filterValue}`
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function deleteProductById(id, img) {
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).delete(
      `/products/delete/?id=${id}&img=${img}`
    );
    return result;
  } catch (error) {
    return error.response;
  }
}

export async function updateProduct(data, img) {
  try {
    const result = await jsonInstance(localStorage.getItem("jwt")).post(
      "/products/update",
      data
    );

    if (img) {
      const image = new FormData();
      image.append("image", img);
      await imgInstance(localStorage.getItem("jwt")).post(
        "products/img",
        image
      );
    }
    return result;
  } catch (error) {
    return error.response;
  }
}
