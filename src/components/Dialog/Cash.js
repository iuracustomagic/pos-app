/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import PropTypes from 'prop-types';
import NumberPanel from 'common/NumberPanel';
import translate from 'assets/translation';

function Cash({ settings }) {
  const [sum, setSum] = useState('');
  const lang = useSelector((state) => state.application.lang);
  const dispatch = useDispatch();

  const send = () => {
    if (sum > 0) {
      settings.cb(sum > settings.limit ? settings.limit : sum);
      setSum('');
    }
  };

  return (
    <div className="cash">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
        <h4 className="modal-title">{ settings.header }</h4>
      </div>
      <div className="modal-body">
        <NumberPanel insert={setSum}>
          <div className="children">
            <div className="input-group">
              <input value={sum} type="text" placeholder={translate[lang]['Enter sum']} readOnly className="form-control" />
              <span className="input-group-text">
                <button onClick={() => setSum('')} className="clear-input" type="button">
                  <i className="fa fa-close" />
                </button>
              </span>
            </div>
          </div>
        </NumberPanel>
      </div>
      <div className="modal-footer">
        <div className="agree">
          <button onClick={send} className="btn btn-primary" type="button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

Cash.propTypes = {
  settings: PropTypes.shape({
    cb: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    limit: PropTypes.number,
  }).isRequired,
};

export default Cash;
