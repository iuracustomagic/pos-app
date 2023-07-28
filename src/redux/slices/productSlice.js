/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import {
  countSumIfArray,
  // pushPromotion,
  ifBelongsPromotion,
  countPromotion as countPromotionHelper
} from "helpers/products";

const slice = createSlice({
  name: "product",
  initialState: {
    hold: JSON.parse(localStorage.getItem("hold") || "[]"),
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    promotion: [],
    categories: [],
    sum: 0,
    full: 0,
    items: 0,
    discount: null
  },
  reducers: {
    editState(state, { payload }) {
      state[payload.type] = payload[payload.type];
    },
    addProduct(state, { payload }) {
      console.log(payload.product)
      const index = payload.product.weight
        ? -1
        : state.cart.findIndex((l) => l._id === payload.product._id);
      const price = payload.product.weight
        ? +((payload.product.price * payload.weight) / 1000).toFixed(2)
        : +(payload.product.price * (state.cart[index]?.qty + 1 || 1)).toFixed(
            2
          );

      state.items += 1;
      state.full = +(
        payload.product.weight
          ? state.full + price
          : state.full + payload.product.price
      ).toFixed(2);

      if (index > -1) {
        const copy = [...state.cart];
        copy.splice(index, 1, {
          ...copy[index],
          qty: copy[index].qty + 1,
          fullPrice: price,
          countedPrice: countSumIfArray(
            state.cart[index].discount,
            price,
            copy[index].qty + 1,
            state.discount
          )
        });
        state.cart = copy;
        countPromotionHelper(state, index);
        state.sum = state.cart.reduce(
          (prev, item) => +(prev + item.countedPrice).toFixed(2),
          0
        );
        return;
      }

      // const promotion = payload.product.discount.find(
      //   (cur) => cur.guarantee?.items
      // );

      state.cart.push({
        ...payload.product,
        qty: payload.weight || 1,
        fullPrice: price,
        ...ifBelongsPromotion(state, payload.product._id),
        countedPrice: countSumIfArray(
          payload.product.discount,
          price,
          1,
          state.discount
        )
      });

      // if (promotion) {
      //   pushPromotion(state, promotion, payload.product._id);
      // }

      if (state.cart[state.cart.length - 1].guarantee) {
        countPromotionHelper(state, state.cart.length - 1);
      }

      state.sum = state.cart.reduce(
        (prev, item) => +(prev + item.countedPrice).toFixed(2),
        0
      );
    },
    countPromotion(state, { payload }) {
      countPromotionHelper(state, payload);

      state.sum = state.cart.reduce(
        (prev, item) => +(prev + item.countedPrice).toFixed(2),
        0
      );
    },
    removePromotion(state, { payload }) {
      state.cart = payload.cart.map((cur) => {
        if (cur.guarantee && cur.guarantee.ref === payload.ref) {
          const copy = { ...cur };
          delete copy.guarantee;
          return {
            ...copy,
            countedPrice: countSumIfArray(
              cur.discount,
              cur.fullPrice,
              cur.qty,
              state.discount
            )
          };
        }

        return cur;
      });

      const copy = [...state.promotion];
      copy.splice(payload.idx, 1);
      state.promotion = copy;

      state.sum = state.cart.reduce((prev, cur) => prev + cur.countedPrice, 0);
    }
  }
});

export default slice.reducer;
export const { editState, addProduct, countPromotion, removePromotion } =
  slice.actions;
