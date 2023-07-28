/* eslint-disable no-mixed-operators */
import React from "react";
import { useSelector } from "react-redux";
import translate from "assets/translation";

function Bills() {
  const lang = useSelector((state) => state.application.lang);
  const sum = useSelector((state) => state.product.sum);
  const items = useSelector((state) => state.product.items);
  const full = useSelector((state) => state.product.full);

  return (
    <div className="mt-4 cart-info">
      <div className="price-segment">
        <div className="price-container">
          {`${translate[lang].Price}: ${full.toFixed(2)}`}
        </div>
      </div>
      <div className="discounting-segment">
        <div className="total-items">
          {`${translate[lang]["Total Item"]}(${translate[lang].ItemMulti}): ${items}`}
        </div>
        <div className="price-discount">
          {`${translate[lang]["Price after discount"]}: `}
          <h3>{sum.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default Bills;
