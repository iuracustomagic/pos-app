/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import PropTypes from 'prop-types';

function Critical({ error }) {
  const [interval, setInterval] = useState(null);
  const dispatch = useDispatch();

  const closeProcedure = () => {
    clearInterval(interval);
    dispatch(resetDialog());
  };

  useEffect(() => {
    setInterval(setTimeout(() => { dispatch(resetDialog()); }, 7500));
  }, []);

  return (
    <div className="critical-error">
      <div className="modal-header">
        <button onClick={closeProcedure} type="button" className="close">×</button>
        <h4 className="modal-title">Error!!!</h4>
      </div>
      <div className="modal-body">
        <h3>Pay Attention!</h3>
        { error }
      </div>
    </div>
  );
}

Critical.propTypes = {
  error: PropTypes.array.isRequired,
};

export default Critical;
