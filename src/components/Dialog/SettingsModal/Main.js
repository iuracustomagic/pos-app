/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialized } from 'redux/slices/stateSlice';
import { setApplicationSettings } from 'redux/slices/applicationSlice';
import PropTypes from 'prop-types';
import translate from 'assets/translation';

const { ipcRenderer } = window.require
  ? window.require('electron')
  : { ipcRenderer: { send: () => {}, on: () => {} } };

function Main({ setSendData, sendData, state }) {
  const lang = useSelector((store) => store.application.lang);
  const version = useSelector((store) => store.application.currentVersion);
  const versions = useSelector((store) => store.application.versionsAvailable);
  const app = useSelector((store) => store.application.applicationSettings);
  const { api_url } = useSelector((store) => store.application.applicationSettings);
  const [choosenVersion, setChoosenVersion] = useState('');
  const dispatch = useDispatch();

  const update = () => {
    if (process.env.NODE_ENV === 'production') {
      ipcRenderer.send('update-specific-version', choosenVersion);

      dispatch(setInitialized(false));
    }
  };

  const downloadNom = () => {
    ipcRenderer.send('download-products', true);

    dispatch(setInitialized(false));
  };

  const getImg = (e) => {
    const renamedFile = new File([e.target.files[0]], 'logo.bmp', {
      type: e.target.files[0].type,
    });

    setSendData({ ...sendData, img: renamedFile });
  };

  return (
    <div className="d-flex">
      <div className="col-md-6">
        <div className={`form-group ${state ? 'was-validated' : ''}`}>
          <label>{ translate[lang]['Store Name'] }</label>
          <input onChange={(e) => setSendData({ ...sendData, store_name: e.target.value })} value={sendData.store_name || ''} className="form-control" type="text" required="required" />
          <div className="invalid-feedback">Please set the store name!</div>
        </div>
        <div className="form-group">
          <label>Cass ID</label>
          <input onChange={(e) => setSendData({ ...sendData, cass_id: e.target.value })} value={sendData.cass_id || ''} className="form-control" type="number" />
        </div>
        <div className="form-group">
          <label>{ translate[lang]['Store ID'] }</label>
          <input onChange={(e) => setSendData({ ...sendData, store_id: e.target.value })} value={sendData.store_id || ''} className="form-control" type="number" />
        </div>
        <div className="form-group">
          <label>API url</label>
          <input onChange={(e) => setSendData({ ...sendData, api_url: e.target.value })} value={sendData.api_url || ''} className="form-control" type="text" />
        </div>
        <div className={`form-group ${state ? 'was-validated' : ''}`}>
          <label>{ `${translate[lang]['Address Line']}` }</label>
          <input onChange={(e) => setSendData({ ...sendData, first_adress: e.target.value })} value={sendData.first_adress || ''} className="form-control" type="text" required="required" />
          <div className="invalid-feedback">Please set the store address!</div>
        </div>
        <div className="form-group">
          <label>
            <input onChange={(e) => setSendData({ ...sendData, initialize: e.target.checked })} checked={sendData?.initialize || false} className="form-check-input" type="checkbox" />
            {`  ${translate[lang]['Wait for full initialization']}`}
          </label>
        </div>
        <div className="form-group">
          <label>
            <input onChange={(e) => setSendData({ ...sendData, display: e.target.checked })} checked={sendData.display || false} className="form-check-input" type="checkbox" />
            {`  ${translate[lang]['Display control buttons']}`}
          </label>
        </div>
      </div>
      <div className="col-md-6">
        <div className={`form-group ${state ? 'was-validated' : ''}`}>
          <label>{ translate[lang]['Currency Symbol'] }</label>
          <input onChange={(e) => setSendData({ ...sendData, currency: e.target.value })} value={sendData.currency || ''} className="form-control" type="text" required="required" />
          <div className="invalid-feedback">Please set the currency symbol!</div>
        </div>
        <div className="form-group">
          <label>{ translate[lang]['Receipt Footer'] }</label>
          <textarea onChange={(e) => setSendData({ ...sendData, reciept: e.target.value })} value={sendData.reciept || ''} className="form-control" />
        </div>
        {
          process.env.NODE_ENV === 'production' && api_url ? (
            <div className="form-group mt-2 float-right">
              <button onClick={downloadNom} className="btn btn-primary" type="button">Download all nomenclatures</button>
            </div>
          ) : null
        }
        {
          sendData.z !== undefined && sendData.z !== true ? (
            <div className="form-group mt-2 float-right">
              <button onClick={() => { dispatch(setApplicationSettings({ ...app, z: undefined })); setSendData({ ...sendData, z: undefined }); }} className="btn btn-primary" type="button">Restore last Z report</button>
            </div>
          ) : null
        }
        {
          sendData.img === true ? (
            <div className="form-group mt-2 d-flex align-items-center float-right">
              <label className="m-r-15">
                <button onClick={() => setSendData({ ...sendData, img: false })} type="button" className="btn btn-xs btn-warning">{ translate[lang].Remove }</button>
              </label>
              <img src="./images/logo.bmp" alt="logo" className="logo-img" />
            </div>
          ) : (
            <input className="mt-2 float-right" onChange={getImg} type="file" accept=".bmp" />
          )
        }
        {
          versions.length ? (
            <div className="form-group">
              <label>{translate[lang]['Choose version']}</label>
              <div className="version-select">
                <select onChange={(e) => { setChoosenVersion(e.target.value); }} defaultValue="" className="form-control">
                  <option disabled value="">{ version }</option>
                  {
                    versions.map((cur) => (
                      <option key={`version-${cur.name}`} value={cur.name}>{ cur.name }</option>
                    ))
                  }
                </select>
              </div>
              <button
                onClick={update}
                disabled={version === choosenVersion && choosenVersion.length}
                className="btn btn-primary mt-2 float-right"
                type="button"
              >
                { translate[lang]['Click to update'] }
              </button>
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

Main.propTypes = {
  setSendData: PropTypes.func.isRequired,
  sendData: PropTypes.object.isRequired,
  state: PropTypes.bool.isRequired,
};

export default Main;
