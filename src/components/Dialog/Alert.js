import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import RefreshConnection from 'components/MainPage/Header/RefreshConnection';

function Alert() {
  const issues = useSelector((state) => state.state.issues);
  const errors = useSelector((state) => state.state.errors);
  const dispatch = useDispatch();

  return (
    <div className="alert-modal">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
      </div>
      <div className="modal-body">
        <div className="refresh-devices mb-2"><RefreshConnection /></div>
        {issues.length ? (
          <div className="warnings-container">
            <h3>All warnings:</h3>
            {
              issues.map((cur) => (
                <pre>{ cur }</pre>
              ))
            }
          </div>
        ) : null}
        {errors.length ? (
          <div className="errors-container">
            <h3>All errors:</h3>
            {
            errors.map((cur) => (
              <pre>{ cur }</pre>
            ))
          }
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Alert;
