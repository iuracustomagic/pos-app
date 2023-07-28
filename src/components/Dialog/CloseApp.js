/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import { settings } from 'controllers/index';
import translate from 'assets/translation';

function QuitModal() {
  const lang = useSelector((state) => state.application.lang);
  const dispatch = useDispatch();

  const close = () => {
    localStorage.clear('jwt');
    settings.closeApp(localStorage.getItem('jwt'));
  };

  return (
    <div className="quit-modal">
      <div className="modal-body">
        <button onClick={() => { dispatch(resetDialog()); }} className="btn btn-close float-end" type="button" />
        <h2 className="text-center">{ `${translate[lang]['Are you sure']}?` }</h2>
        <h4 className="text-center">{ translate[lang]['You are about to close the application.'] }</h4>
        <div className="d-flex justify-content-center gap-2">
          <button onClick={close} className="btn btn-danger" type="button">{ translate[lang]['Close Application'] }</button>
          <button onClick={() => { dispatch(resetDialog()); }} className="btn btn-primary" type="button">{ translate[lang].Close }</button>
        </div>
      </div>
    </div>
  );
}

export default QuitModal;
