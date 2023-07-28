/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import translate from "assets/translation";
import { StockContext } from "../Content";

function Table() {
  const cart = useSelector((state) => state.product.cart);
  const lang = useSelector((state) => state.application.lang);
  const { currency } = useSelector(
    (state) => state.application.applicationSettings
  );
  const { decrement, increment, clearOrders, deletePosition } =
    useContext(StockContext);

  return (
    <div className="table-container">
      <table className="table order-table m-0">
        <thead>
          <tr>
            <th className="id">#</th>
            <th className="name">{translate[lang].Item}</th>
            <th className="control">{translate[lang].Qty}</th>
            <th className="price">{translate[lang].Price}</th>
            <th className="remove">
              <button
                onClick={clearOrders}
                type="button"
                className="btn btn-danger"
              >
                <i className="fa fa-times" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.map((order, idx) => (
            <tr key={`${order._id}-${idx}-orders`}>
              <td className="id">{idx + 1}</td>
              <td className="name">{order.name}</td>
              <td className="control">
                <div className="input-group">
                  {!order.weight && (
                    <div className="input-group-btn btn-xs">
                      <button
                        onClick={() => decrement(idx)}
                        type="button"
                        className="btn btn-default btn-xs"
                      >
                        <i className="fa fa-minus" />
                      </button>
                    </div>
                  )}
                  <input
                    className="form-control"
                    size="1"
                    type="text"
                    value={
                      order.weight
                        ? `${(+order.qty / 1000).toFixed(3)} Kg`
                        : order.qty
                    }
                    disabled
                  />
                  {!order.weight && (
                    <div className="input-group-btn btn-xs">
                      <button
                        onClick={() => increment(idx)}
                        type="button"
                        className="btn btn-default btn-xs"
                      >
                        <i className="fa fa-plus" />
                      </button>
                    </div>
                  )}
                </div>
              </td>
              <td className="price">
                {+order.countedPrice.toFixed(2) <
                +order.fullPrice.toFixed(2) ? (
                  <>
                    <span className="text-decoration-line-through">
                      {`${order.fullPrice.toFixed(2)} ${
                        currency || "Currency not set!"
                      }`}
                    </span>
                    <br />
                    <span>{`${order.countedPrice.toFixed(2)} ${
                      currency || "Currency not set!"
                    }`}</span>
                  </>
                ) : (
                  <span>{`${order.countedPrice.toFixed(2)} ${
                    currency || "Currency not set!"
                  }`}</span>
                )}
              </td>
              <td className="remove">
                <button
                  onClick={() => deletePosition(idx)}
                  type="button"
                  className="btn btn-danger btn-xs"
                >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
