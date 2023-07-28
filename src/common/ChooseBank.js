import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function ChooseBank({ terminal, setTerminal }) {
  const availableTerminals = useSelector((state) => state.state.initializedDevices.terminal);

  return (
    <div className="select-payment">
      <div className="list-group">
        {
          availableTerminals.map((cur) => (
            (cur.model && cur.status)
              ? (
                <button key={`paymentmethod${cur.model}`} onClick={() => setTerminal(cur.model)} type="button" className={`list-group-item ${terminal === cur.model ? 'active' : ''}`}>
                  <img src={`/images/${cur.model}.png`} alt="bank" />
                  <h4>{ `${cur.model.slice(0, 1).toUpperCase()}${cur.model.slice(1)}` }</h4>
                </button>
              )
              : null
          ))
        }
      </div>
    </div>
  );
}

ChooseBank.propTypes = {
  terminal: PropTypes.string.isRequired,
  setTerminal: PropTypes.func.isRequired,
};

export default ChooseBank;
