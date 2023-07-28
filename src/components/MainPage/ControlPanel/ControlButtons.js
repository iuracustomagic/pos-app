/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-mixed-operators */
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModal, setDialog, resetDialog } from 'redux/slices/modalSlice';
import translate from 'assets/translation';

function ControlButtons() {
  const lang = useSelector((state) => state.application.lang);
  const cart = useSelector((state) => state.product.cart);
  const sum = useSelector((state) => state.product.sum);
  const device = useSelector((state) => state.state.initializedDevices);
  const payment = useSelector((state) => state.state.payment);
  const { z } = useSelector((state) => state.application.applicationSettings);
  const dispatch = useDispatch();

  const showPaymentModal = useCallback((mode) => {
    dispatch(setDialog(['PaymentMethod', { items: cart, mode }]));
  }, [cart]);

  const proceedCash = useCallback((card, cash) => {
    if (+card + +cash < +sum) {
      dispatch(setModal({ text: translate[lang]['The total amount is less than the price of the products'] }));
      dispatch(resetDialog());
      return;
    }

    showPaymentModal([{ mode: 1, sum: +card }, { mode: 0, sum: +cash }]);
  }, [sum]);

  const proceedCard = useCallback((card) => {
    dispatch(setDialog([
      'Cash',
      {
        header: translate[lang]['Set sum that needs to be paid by cash'],
        cb: (cash) => {
          proceedCash(card, cash);
        },
        limit: Math.min(),
      },
    ]));
  }, []);

  const combinedPayment = useCallback(() => {
    dispatch(setDialog([
      'Cash',
      {
        header: translate[lang]['Set sum that needs to be paid by card'],
        cb: proceedCard,
        limit: sum,
      },
    ]));
  }, [sum]);

  const checkForZReport = useMemo(() => {
    if (z === undefined || z === true) return true;
    return Math.floor((new Date() - new Date(z)) / (1000 * 60 * 60)) <= 24;
  }, [z]);

  return (
    <>
      {
        checkForZReport ? (
          device.fiscal?.status || process.env.NODE_ENV === 'development' ? (
            <div className="button-list">
              <div className="d-flex">
                <button onClick={() => showPaymentModal([{ mode: 0 }])} disabled={!cart?.length || payment} type="button" className="btn btn-success waves-effect waves-light">
                  <span className="btn-label"><i className="fa fa-money" /></span>
                  <span className="flex-grow-1">
                    {translate[lang].Cash}
                  </span>
                </button>
                {
                  device?.terminal?.length || process.env.NODE_ENV === 'development' ? (
                    <>
                      <button onClick={() => showPaymentModal([{ mode: 1, sum: +sum.toFixed(2) }])} disabled={!cart?.length || payment} type="button" className="btn btn-success waves-effect waves-light">
                        <span className="btn-label"><i className="fa fa-bank" /></span>
                        <span className="flex-grow-1">
                          {translate[lang].Card}
                        </span>
                      </button>
                      <button onClick={combinedPayment} disabled={!cart?.length || payment} className="btn btn-success waves-effect waves-light" type="button">
                        <span className="btn-label"><i className="fa fa-bank" /></span>
                        <span className="flex-grow-1">
                          {translate[lang].Combined}
                        </span>
                      </button>
                    </>
                  ) : null
                }
              </div>
            </div>
          ) : (
            <div className="span-container">
              <span>{ `${translate[lang]['Fiscal printer is not connected']}!` }</span>
            </div>
          )
        ) : (
          <div className="span-container">
            <span>{ `${translate[lang]['To use the fiscal printer, you need to print a Z report']}!` }</span>
          </div>
        )
      }
    </>
  );
}

export default ControlButtons;
