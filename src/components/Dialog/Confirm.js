/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import PropTypes from 'prop-types';
import translate from 'assets/translation';

function Confirm({ settings }) {
  const lang = useSelector((state) => state.application.lang);
  const dispatch = useDispatch();

  return (
    <div className="confirm-modal">
      <div className="modal-body">
        <button onClick={() => { dispatch(resetDialog()); }} className="btn btn-close float-end" type="button" />
        <h2 className="text-center">{ `${translate[lang]['Are you sure']}?` }</h2>
        <h4 className="text-center">{ translate[lang][settings.description] }</h4>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button onClick={() => { settings.action(settings.args); }} className="btn btn-danger" type="button">{ translate[lang].Yes }</button>
          <button onClick={() => { dispatch(resetDialog()); }} className="btn btn-primary" type="button">{ translate[lang].Cancel }</button>
        </div>
      </div>
    </div>
  );
}

Confirm.propTypes = {
  settings: PropTypes.objectOf({
    action: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
    args: PropTypes.array,
  }),
};

Confirm.defaultProps = {
  settings: PropTypes.objectOf({
    args: undefined,
  }),
};

export default Confirm;
