/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import translate from 'assets/translation';
import Extra from './Extra';

function Fiscal({ setSendData, sendData, state, com, listDevices }) {
  const lang = useSelector((store) => store.application.lang);

  const edit = (e, param) => {
    const copy = { ...sendData };
    if (!copy?.connectedDevices?.fiscal) {
      copy.connectedDevices.fiscal = {};
    }
    copy.connectedDevices.fiscal[param] = e.target.value;
    setSendData(copy);
  };

  const hasCom = listDevices.fiscal[sendData?.connectedDevices?.fiscal?.model]?.find((cur) => cur?.version === sendData.connectedDevices.fiscal?.version)?.com;

  return (
    <div className="container">
      <div className="d-flex">
        <div className="col-md-6">
          <div className={`form-group ${state ? 'was-validated' : ''}`}>
            <label>Choose manufacturer</label>
            <select onChange={(e) => edit(e, 'model')} style={{ textTransform: 'capitalize' }} defaultValue={sendData?.connectedDevices?.fiscal?.model || ''} className="form-select" required="required">
              <option disabled hidden value="">{ translate[lang]['Select a manufacturer'] }</option>
              {
                Object.keys(listDevices.fiscal).map((manufac) => (
                  <option disabled={!listDevices.fiscal[manufac].length} style={{ textTransform: 'capitalize' }} key={manufac} value={manufac}>{ manufac }</option>
                ))
              }
            </select>
            <div className="invalid-feedback">Please set the fiscal printer!</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`form-group ${state ? 'was-validated' : ''}`}>
            <label>Choose model</label>
            <br />
            {
            listDevices.fiscal[sendData?.connectedDevices?.fiscal?.model]?.length ? (
              <select onChange={(e) => edit(e, 'version')} style={{ textTransform: 'capitalize' }} value={sendData?.connectedDevices?.fiscal?.version || ''} className="form-select" required="required">
                <option disabled hidden value="">{ translate[lang]['Select a model'] }</option>
                {
                  listDevices.fiscal[sendData?.connectedDevices?.fiscal?.model].map((mod) => (
                    <option style={{ textTransform: 'capitalize' }} key={mod.version} value={mod.version}>{ mod.version }</option>
                  ))
                }
              </select>
            ) : <span>{ translate[lang]['Sorry, we don\'t have yet models for this manufacter']}</span>
          }
            <div className="invalid-feedback">Please set the fiscal printer model!</div>
          </div>
        </div>
      </div>
      <div className="extra-settings">
        <Extra
          setSendData={setSendData}
          device="fiscal"
          id="fiscal"
          checked={sendData?.connectedDevices?.fiscal?.critical || false}
          hasCom={hasCom || false}
          com={com}
          selectedCom={sendData?.connectedDevices?.fiscal?.com || 0}
          state={state}
        />
      </div>
    </div>
  );
}

Fiscal.propTypes = {
  setSendData: PropTypes.func.isRequired,
  sendData: PropTypes.object.isRequired,
  state: PropTypes.bool.isRequired,
  com: PropTypes.array.isRequired,
  listDevices: PropTypes.object.isRequired,
};

export default Fiscal;
