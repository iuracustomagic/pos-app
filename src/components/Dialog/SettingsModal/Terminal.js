/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import translate from 'assets/translation';
import Extra from './Extra';

function Terminal({ setSendData, sendData, state, com, listDevices }) {
  const [enableToEdit, setEnableToEdit] = useState(true);
  const lang = useSelector((store) => store.application.lang);

  const edit = (e, idx, param) => {
    const editted = {
      ...sendData,
      connectedDevices: {
        ...sendData.connectedDevices,
        terminal: sendData.connectedDevices.terminal.map((cur, index) => (
          index === idx ? { ...sendData.connectedDevices.terminal[idx], [param]: e.target.value } : cur
        )),
      },
    };

    setSendData(editted);
    setEnableToEdit(editted.connectedDevices.terminal.every(
      (terminal) => Boolean(terminal.model) && Boolean(terminal.version),
    ));
  };

  const addTerminal = () => {
    setSendData({
      ...sendData,
      connectedDevices: {
        ...sendData.connectedDevices,
        terminal: [...sendData.connectedDevices.terminal, { model: '', version: '' }],
      },
    });

    setEnableToEdit(false);
  };

  const deleteTerminal = (idx) => {
    const editted = {
      ...sendData,
      connectedDevices: {
        ...sendData.connectedDevices,
        terminal: sendData.connectedDevices.terminal.filter((cur, index) => idx !== index),
      },
    };

    setSendData(editted);
    setEnableToEdit(editted.connectedDevices.terminal.every(
      (terminal) => Boolean(terminal.model) && Boolean(terminal.version),
    ));
  };

  return (
    <div className="container terminal">
      {
        enableToEdit && Object.keys(listDevices.terminal).length > sendData.connectedDevices.terminal.length
          ? <button onClick={addTerminal} className="btn btn-primary" type="button">Add terminal</button> : null
      }
      {
        sendData.connectedDevices.terminal.map((terminal, idx) => (
          <div key={terminal.model} className="position-relative">
            <div className="d-flex justify-content-between flex-wrap">
              <div className="col-md-5">
                <div className={`form-group ${state ? 'was-validated' : ''}`}>
                  <label>Choose manufacturer</label>
                  <select disabled={enableToEdit} onChange={(e) => edit(e, idx, 'model')} style={{ textTransform: 'capitalize' }} value={terminal?.model || ''} className="form-select" required="required">
                    <option hidden={terminal.version.length} value="" disabled>{ translate[lang]['Select a manufacturer'] }</option>
                    {
                      Object.keys(listDevices.terminal)?.map((manufac) => (
                        <option disabled={!listDevices?.terminal[manufac]?.length} hidden={sendData.connectedDevices.terminal.some((cur) => manufac === cur.model)} style={{ textTransform: 'capitalize' }} key={manufac} value={manufac}>{ manufac }</option>
                      ))
                    }
                  </select>
                  <div className="invalid-feedback">Please set terminal manufacter!</div>
                </div>
              </div>
              <div className="col-md-5">
                <div className={`form-group ${state ? 'was-validated' : ''}`}>
                  <label>Choose model</label>
                  <br />
                  {
                    listDevices.terminal[terminal?.model]?.length ? (
                      <select onChange={(e) => edit(e, idx, 'version')} style={{ textTransform: 'capitalize' }} value={terminal.version || ''} className="form-select" required="required">
                        <option hidden={terminal.version.length} value="" disabled>{ translate[lang]['Select a model'] }</option>
                        {
                          listDevices.terminal[terminal?.model]?.map((mod) => (
                            <option style={{ textTransform: 'capitalize' }} key={mod.version} value={mod.version}>{ mod.version }</option>
                          ))
                        }
                      </select>
                    ) : <span>{ translate[lang]['Sorry, we don\'t have yet models for this manufacter'] }</span>
                  }
                  <div className="invalid-feedback">Please set terminal model!</div>
                </div>
              </div>
              <button onClick={() => deleteTerminal(idx)} className="btn btn-danger remove-terminal" type="button"><i className="fa fa-times" /></button>
            </div>
            <div className="extra-settings">
              <Extra
                setSendData={setSendData}
                device="terminal"
                model={idx}
                id={terminal.version}
                checked={terminal.critical || false}
                hasCom={terminal.model ? listDevices.terminal[terminal.model]?.find((cur) => cur.version === terminal.version)?.com : false}
                com={com}
                selectedCom={terminal.com || 0}
                state={state}
              />
            </div>
          </div>
        ))
      }
    </div>
  );
}

Terminal.propTypes = {
  setSendData: PropTypes.func.isRequired,
  sendData: PropTypes.object.isRequired,
  state: PropTypes.bool.isRequired,
  com: PropTypes.array.isRequired,
  listDevices: PropTypes.object.isRequired,
};

export default Terminal;
