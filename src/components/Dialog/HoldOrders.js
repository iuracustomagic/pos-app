/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editState } from 'redux/slices/productSlice';
import translate from 'assets/translation';
import { resetDialog } from 'redux/slices/modalSlice';

function HoldOrders() {
  const lang = useSelector((state) => state.application.lang);
  const hold = useSelector((state) => state.product.hold);
  const dispatch = useDispatch();

  const remove = (idx) => {
    const copy = [...hold];
    copy.splice(idx, 1);
    dispatch(editState({ type: 'hold', hold: copy }));
    localStorage.setItem('hold', JSON.stringify(copy));
  };

  const moveCart = (cart, idx) => {
    let items = 0;
    let sum = 0;

    dispatch(editState({ type: 'cart', cart }));

    cart.forEach((item) => {
      items += item.weight ? 1 : item.qty;
      sum += item.countedPrice;
    });

    dispatch(editState({ type: 'sum', sum }));
    dispatch(editState({ type: 'items', items }));
    remove(idx);
    dispatch(resetDialog());
  };

  return (
    <div className="hold-orders">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
        <h4 className="modal-title">Open Orders</h4>
      </div>
      <div className="modal-body">
        <div className="row">
          {
            hold.length ? hold.map((cur, idx) => (
              <div key={`order-${idx}`} className="order col-md-6">
                <ul className="list-group">
                  {
                    cur.map((cart, index) => (
                      <li key={`${cart._id}-${cart.qty}-${index}`} className="list-group-item">
                        <span>{ cart.name }</span>
                        <span>{ cart.weight ? `${cart.qty / 1000} kg` : `x ${cart.qty}` }</span>
                      </li>
                    ))
                  }
                </ul>
                <div className="control-buttons">
                  <button onClick={() => moveCart(cur, idx)} type="button" className="btn btn-info btn-xs">
                    <span className="btn-label">
                      <i className="fa fa-shopping-basket" />
                    </span>
                    {
                      translate[lang]['Move to cart']
                    }
                  </button>
                  <button onClick={() => { remove(idx); }} type="button" className="btn btn-danger btn-xs">
                    <span className="btn-label">
                      <i className="fa fa-trash" />
                    </span>
                    {
                      translate[lang].Remove
                    }
                  </button>
                </div>
              </div>
            )) : <h3 className="center">{ translate[lang]['No items in the hold orders'] }</h3>
          }
        </div>
      </div>
    </div>
  );
}

export default HoldOrders;
