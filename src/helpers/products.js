/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { isToday } from "helpers";

export const countGuarantee = (price, qty, guarantee) =>
  Math.max(+(price - guarantee * (price / qty)).toFixed(2), 0);

export const countSumCard = (discountCard, price) => {
  // 3d parametr qty
  if (discountCard.regular) {
    return price - (price * discountCard.regular.percent) / 100;
  }

  return price;
};

export const countSum = (discount, price, qty, countedDiscount = 0) => {
  if (discount.regular) {
    const counted = +(price - (price * discount.regular.percent) / 100).toFixed(
      2
    );

    if (countedDiscount > counted || discount.regular.if_card) {
      return countedDiscount;
    }

    return counted;
  }

  if (discount.guarantee) {
    if (discount.guarantee.items) {
      return price;
    }

    const count = Math.floor(qty / (discount.guarantee.count + 1));

    return countGuarantee(price, qty, count);
  }

  if (discount.date) {
    const counted = +(price - (price * discount.date.percent) / 100).toFixed(2);

    if (countedDiscount < counted) {
      return countedDiscount;
    }

    if (isToday(discount.date.start, discount.date.end)) {
      return counted;
    }
  }

  return countedDiscount;
};

export const countSumIfArray = (discount, price, qty, discountCard) => {
  const haveGuarantee = discount.some((cur) => cur.guarantee);
  const countedDiscount = +countSumCard(discountCard || {}, price, qty).toFixed(
    2
  );

  if (discount instanceof Array && discount.length) {
    return discount.reduce(
      (prev, cur) =>
        Math.min(countSum(cur, price, qty, countedDiscount, prev), prev),
      haveGuarantee ? price : countedDiscount
    );
  }

  return countSum(discount, price, qty, countedDiscount);
};

export const countPromotion = (state, index = false) => {
  if (
    index !== false &&
    !state.cart[index].discount.some((cur) => cur.guarantee)
  ) {
    if (!state.cart[index].guarantee) {
      return;
    }

    const item = state.cart.find(
      (cart) => cart._id === state.cart[index].guarantee.ref
    );

    if (state.cart[index].guarantee.percent) {
      const counted =
        state.cart[index].fullPrice -
        (state.cart[index].fullPrice * state.cart[index].guarantee.percent) /
          100;
      state.cart[index].countedPrice =
        counted < state.cart[index].countedPrice
          ? counted
          : state.cart[index].countedPrice;
      return;
    }

    state.cart[index].countedPrice = countGuarantee(
      state.cart[index].fullPrice,
      state.cart[index].qty,
      Math.floor((item.qty ?? 1) / (state.cart[index].guarantee.count + 1))
    );
    return;
  }

  state.cart = state.cart.map((cur) => {
    if (cur.guarantee) {
      const item = state.cart.find((cart) => cart._id === cur.guarantee.ref);

      return {
        ...cur,
        countedPrice: countGuarantee(
          cur.fullPrice,
          cur.qty,
          Math.floor((item.qty ?? 1) / (cur.guarantee.count + 1))
        )
      };
    }
    return cur;
  });
};

export const ifBelongsPromotion = (state, _id) => ({
  ...(state.promotion.find((cur) =>
    cur.guarantee.items.some((items) => items === _id)
  ) ?? {}),
  _id
});

export const pushPromotion = (state, promotion, ref) => {
  state.promotion.push({
    guarantee: {
      ...promotion.guarantee,
      used: 0,
      ref
    }
  });

  state.cart = state.cart.map((cur) =>
    promotion.guarantee.items.some((prom) => prom === cur._id)
      ? { ...cur, guarantee: { ...promotion.guarantee, used: 0, ref } }
      : cur
  );
};

export const returnText = (product) => {
  if (product.discount.guarantee) {
    if (product.discount.guarantee.items) {
      return {
        percent: `Discount: other items`
      };
    }

    return {
      percent: `Discount: ${product.discount.guarantee.count} + 1`
    };
  }

  if (product.discount.date) {
    const sum = countSum(product.discount, product.price * product.measure, 1);

    return {
      sum,
      percent:
        sum < +(product.price * product.measure).toFixed(2)
          ? `Discount: ${
              product.discount[
                Object.keys(product.discount).find(
                  (cur) => product.discount[cur]?.percent
                )
              ].percent
            }%`
          : "Discount isn't available"
    };
  }

  return {
    sum: countSum(product.discount, product.price * product.measure, 1),
    percent: `Discount: ${
      product.discount[
        Object.keys(product.discount).find(
          (cur) => product.discount[cur]?.percent
        )
      ].percent
    }%`
  };
};
