/* eslint-disable no-mixed-operators */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { returnText } from "helpers/products";

function ProductCard({ product }) {
  const { currency } = useSelector(
    (state) => state.application.applicationSettings
  );

  const discount = useMemo(() => {
    if (!(product.discount instanceof Array)) {
      return undefined;
    }

    return product.discount.reduce(
      (prev, cur) => {
        const temp = returnText({ ...product, discount: cur });

        if (!temp) {
          return prev;
        }

        return {
          percent: prev.percent.length
            ? `${prev.percent},\n${temp.percent}`
            : temp.percent,
          sum: temp.sum ? Math.min(temp.sum, prev.sum) : prev.sum
        };
      },
      { percent: "", sum: +(product.price * product.measure).toFixed(2) }
    );
  }, []);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={`./images/${product.img}`} alt="product" />
      </div>
      <div className="product-info">
        <div className="product-name">
          <p>
            {product.name.length > 45
              ? `${product.name.slice(0, 45)}...`
              : product.name}
          </p>
        </div>
        <span className="product-stock">
          Stock
          {product?.stock_disable ? " N/A" : ` ${product.stock || 0}`}
        </span>
        {discount ? (
          <span className="product-discount">{discount.percent}</span>
        ) : null}
        <span className="product-price">
          <span
            className={
              discount?.sum < +(product.price * product.measure).toFixed(2)
                ? "text-decoration-line-through m-r-5"
                : ""
            }
          >
            {`${(product.price * product.measure).toFixed(2)} ${
              currency || "Currency not set!"
            }`}
          </span>
          {discount?.sum < (product.price * product.measure).toFixed(2) ? (
            <span>{`${discount.sum} ${currency || "Currency not set!"}`}</span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object
};

ProductCard.defaultProps = {
  product: {}
};

export default ProductCard;
