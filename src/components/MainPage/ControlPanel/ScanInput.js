import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editState } from 'redux/slices/productSlice';
import { setDialog } from 'redux/slices/modalSlice';
import translate from 'assets/translation';
import { StockContext } from '../Content';

function ScanInput() {
  const lang = useSelector((state) => state.application.lang);
  const cart = useSelector((state) => state.product.cart);
  const hold = useSelector((state) => state.product.hold);
  const { clearOrders } = useContext(StockContext);
  const dispatch = useDispatch();

  const addOnHold = () => {
    localStorage.setItem('hold', JSON.stringify(hold.concat([cart])));
    dispatch(editState({ type: 'hold', hold: hold.concat([cart]) }));
    clearOrders();
  };

  return (
    <div className="control-orders d-flex my-2">
      <button onClick={addOnHold} type="button" disabled={!cart?.length} className="btn btn-grey">
        <span className="btn-label"><i className="fa fa-hand-paper-o" /></span>
        <span className="flex-grow-1">
          {translate[lang].Hold}
        </span>
      </button>
      <button onClick={() => { dispatch(setDialog(['HoldOrders'])); }} type="button" className="btn btn-default">
        <span className="btn-label">
          <i className="fa fa-shopping-basket" />
        </span>
        <span className="flex-grow-1">
          { translate[lang]['Open Tabs'] }
        </span>
      </button>
    </div>
  );
}

export default ScanInput;
