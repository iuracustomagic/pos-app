/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModal, setDialog, resetDialog } from 'redux/slices/modalSlice';
import { setPayment } from 'redux/slices/stateSlice';
import { transactions } from 'controllers';
import { editState } from 'redux/slices/productSlice';
import NumberPanel from 'common/NumberPanel';
import ChooseBank from 'common/ChooseBank';
import PropTypes from 'prop-types';

function PaymentMethod({ paymentData }) {
  const sum = useSelector((state) => state.product.sum);
  const terminal = useSelector((state) => state.state.initializedDevices.terminal);
  const payment = useSelector((state) => state.state.payment);
  const { currency } = useSelector((state) => state.application.applicationSettings);
  const [clientSum, setClientSum] = useState(paymentData.mode.find((cur) => cur.mode === 1)?.sum || '');
  const [chooseTerminal, setChooseTerminal] = useState(terminal.find((cur) => cur.status)?.model || '');
  const dispatch = useDispatch();

  const sendTransaction = async () => {
    try {
      if (isNaN(parseFloat(clientSum)) || (parseFloat(clientSum) < paymentData.mode.find((cur) => cur.mode === 0)?.sum && paymentData.mode.length === 1)) {
        dispatch(setModal({ text: 'Please enter how much money the client gave' }));
        return;
      }

      if (!paymentData.mode && !terminal.length) {
        dispatch(setModal({ text: 'Please select the bank terminal' }));
        return;
      }

      dispatch(setPayment(true));

      const data = {
        ...paymentData,
        clientSum: parseFloat(clientSum),
        sum: +sum.toFixed(2),
        mode: paymentData.mode.map((cur) => (!cur.sum ? ({ ...cur, sum: +clientSum }) : cur)),
      };

      if (terminal.length) {
        data.terminal = chooseTerminal;
      }

      const result = await transactions.addPayment({ data });

      if (result.status !== 200) throw new Error(result.data || result.response.data || 'Transaction failed');
      dispatch(setModal({ text: result.data || 'Transaction completed', state: true }));
      dispatch(editState({ type: 'cart', cart: [] }));
      dispatch(editState({ type: 'sum', sum: 0 }));
      dispatch(editState({ type: 'items', items: 0 }));
      dispatch(editState({ type: 'discount', discount: 0 }));
      dispatch(setPayment(false));
      dispatch(resetDialog());
      localStorage.setItem('cart', []);
    } catch (error) {
      dispatch(setDialog(['Critical', [error?.response?.data || error?.message || 'Critical Error!!!']]));
      dispatch(setPayment(false));
    }
  };

  return (
    <div className="payment-method">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
        <h4 className="modal-title">Payment</h4>
      </div>
      <div className="modal-body">
        <div className="payment-actions">
          <div className="input-group mb-2">
            <span className="input-group-text">
              Price
            </span>
            <input disabled readOnly value={sum.toFixed(2)} type="number" className="form-control" />
          </div>
          <div className="input-group mb-4">
            <span className="input-group-text">
              { `Currency: ${currency || 'Currency is not set!'}` }
            </span>
            <input value={clientSum} type="text" placeholder="0.0" readOnly className="form-control" />
            <span className="input-group-text">
              <button onClick={() => setClientSum('')} className="clear-input" type="button">
                <i className="fa fa-close" />
              </button>
            </span>
          </div>
          {
            paymentData.mode.some((cur) => cur.mode === 0) && paymentData.mode.length === 1 ? (
              <NumberPanel insert={setClientSum} />
            ) : <ChooseBank terminal={chooseTerminal} setTerminal={setChooseTerminal} />
          }
        </div>
      </div>
      <div className="modal-footer">
        <div className="row">
          {
            paymentData.mode.some((cur) => cur.mode === 0) && paymentData.mode.length === 1 ? (
              <button onClick={() => setClientSum(+sum.toFixed(2))} type="button" className="btn btn-info">
                No change
              </button>
            ) : null
          }
          <button disabled={payment} onClick={sendTransaction} type="button" className="btn btn-default btn-block waves-effect waves-light">{ paymentData.mode.some((cur) => cur.mode === 1) ? 'Card payment' : 'Confirm Payment' }</button>
        </div>
        {
          parseFloat(clientSum) > +sum.toFixed(2) && (
            <div className="change">
              { `Change: ${(parseFloat(clientSum) - sum).toFixed(2)}` }
            </div>
          )
        }
      </div>
    </div>
  );
}

PaymentMethod.propTypes = {
  paymentData: PropTypes.object.isRequired,
};

export default PaymentMethod;
