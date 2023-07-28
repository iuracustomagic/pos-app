/* eslint-disable prefer-object-spread */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import translate from 'assets/translation';

function Extra({ setSendData, device, model, id, checked, hasCom, com, selectedCom, state }) {
  const lang = useSelector((store) => store.application.lang);

  const change = (e) => {
    setSendData((oldData) => {
      const copy = JSON.parse(JSON.stringify(oldData));
      typeof model === 'number' ? copy.connectedDevices[device][model].critical = e.target.checked : copy.connectedDevices[device].critical = e.target.checked;
      return copy;
    });
  };

  const changeCom = (e) => {
    setSendData((oldData) => {
      const copy = JSON.parse(JSON.stringify(oldData));
      const [parsedCom] = e.target.value.match(/\d+/);
      typeof model === 'number' ? copy.connectedDevices[device][model].com = +parsedCom : copy.connectedDevices[device].com = +parsedCom;
      return copy;
    });
  };

  return (
    <div className="d-flex mt-3">
      <div className="input-group">
        <label className="input-group-text" htmlFor={`fatal-input-${id}`}>
          <input onChange={change} checked={!!checked} className="form-check-input mt-0" type="checkbox" id={`fatal-input-${id}`} />
          <span>Throw a fatal error</span>
        </label>
      </div>
      {
        com.length ? hasCom && (
          <div className={`form-group ${state}`}>
            <select onChange={changeCom} defaultValue={com.indexOf(selectedCom) === -1 ? '' : selectedCom} className="form-select">
              <option disabled value="">{ translate[lang]['Select a COM port'] }</option>
              {
                com.map((cur) => (
                  <option value={cur} key={`COM-${cur}`}>
                    { `COM: ${cur}` }
                  </option>
                ))
              }
            </select>
          </div>
        ) : <span>{ translate[lang]['You don\'t have any COM ports']}</span>
      }
    </div>
  );
}

Extra.propTypes = {
  setSendData: PropTypes.func.isRequired,
  device: PropTypes.string.isRequired,
  model: PropTypes.number,
  checked: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  hasCom: PropTypes.bool,
  com: PropTypes.array.isRequired,
  selectedCom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  state: PropTypes.bool.isRequired,
};

Extra.defaultProps = {
  model: undefined,
  hasCom: undefined,
};

export default Extra;
