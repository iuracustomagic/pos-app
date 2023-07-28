/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-shadow */
import { fiscal, products } from "controllers/index";
import constrants from "assets/constrants";

const { filterDiscount } = constrants;

export const filter = (value, filter) =>
  !!value.toLocaleLowerCase().match(filter.toLocaleLowerCase())?.length;

export const parseJwt = (token) => {
  if (!token) {
    window.location.pathname = "/";
    return false;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const printReport = async ([type]) => {
  try {
    await fiscal.report(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const time = (time) =>
  `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}` +
  ` ${time.getHours()}:${
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
  }:` +
  `${time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}`;

export const isToday = (compareDateStart, compareDateEnd) => {
  const date = new Date();
  const splittedStart = compareDateStart.split("-").map((cur) => +cur);
  const splittedEnd = compareDateEnd.split("-").map((cur) => +cur);

  if (splittedStart[0] < date.getDay() && splittedEnd[0] > date.getDay()) {
    return true;
  }

  if (splittedStart[0] === date.getDay()) {
    if (splittedStart[1] < date.getHours()) {
      return true;
    }

    if (
      splittedStart[1] === date.getHours() &&
      splittedStart[2] >= date.getMinutes()
    ) {
      return true;
    }
  }

  if (splittedEnd[0] === date.getDay()) {
    if (splittedEnd[1] > date.getHours()) {
      return true;
    }

    if (
      splittedEnd[1] === date.getHours() &&
      splittedEnd[2] >= date.getMinutes()
    ) {
      return true;
    }
  }

  return false;
};

export const sortDiscount = (discount) =>
  discount.sort(
    (a, b) =>
      filterDiscount[
        Object.keys(a).find((cur) => cur !== "_id" && cur !== "__v")
      ] -
      filterDiscount[
        Object.keys(b).find((cur) => cur !== "_id" && cur !== "__v")
      ]
  );

export const getProductIfString = async (product) => {
  try {
    const request = await products.getProductByFilter({
      barcode:
        product.slice(0, 3) === "210" ? `${product.slice(3, -6)}` : `${product}`
    });

    if (request.status !== 200) {
      return false;
    }

    if (request.data.product) {
      return {
        product: request.data.product,
        discount: sortDiscount(request.data.discount),
        weight: request.data.weight
          ? parseInt(product.slice(-6) / 10)
          : undefined
      };
    }

    if (request.data.discount) {
      return request.data;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const setValueFromKeyboard = (symbol, setShift) => {
  if (symbol === "{lock}" || symbol === "{shift}") {
    setShift((prev) => (prev === "default" ? "shift" : "default"));
    return;
  }

  if (symbol === "{enter}") {
    symbol = "\n";
  }

  if (symbol === "{space}") {
    symbol = " ";
  }

  const input = document.activeElement;
  const lastValue = input.value;
  input.value =
    symbol === "{bksp}"
      ? input.value.slice(0, -1)
      : document.activeElement.value + symbol;
  const event = new Event("input", { bubbles: true });
  const tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
};
