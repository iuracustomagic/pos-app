import {
  jsonInstance,
  imgInstance,
  regularInstance
} from "helpers/axiosInstances";

export async function setSettings(data, image) {
  try {
    const result = await jsonInstance(localStorage.getItem("jwt")).post(
      "/settings/post",
      data
    );
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const img =
        image &&
        (await imgInstance(localStorage.getItem("jwt")).post(
          "/settings/img/",
          formData
        ));

      if (!img?.status || img?.status !== 200) return new Error(img);
    }

    return result;
  } catch (error) {
    return error;
  }
}

export async function adImgs(images) {
  try {
    images.map(async (cur) => {
      const formData = new FormData();
      formData.append("image", cur);

      const result = await imgInstance(localStorage.getItem("jwt")).post(
        "settings/ad-img",
        formData
      );
      if (result?.status !== 200) throw new Error(result?.response);
    });
    return true;
  } catch (error) {
    return error;
  }
}

export async function getSettings(controller) {
  try {
    const result = await regularInstance(localStorage.getItem("jwt")).get(
      "/settings",
      { signal: controller }
    );

    return result;
  } catch (error) {
    return error;
  }
}

export function closeApp() {
  jsonInstance(localStorage.getItem("jwt")).post("/settings/stop");
}
