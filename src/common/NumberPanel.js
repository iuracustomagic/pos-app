import React from 'react';
import PropTypes from 'prop-types';

function NumberPanel({ insert, children }) {
  return (
    <div className="row number-panel">
      { children }
      <div className="row">
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}1`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>1</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}2`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>2</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}3`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>3</span>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}4`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>4</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}5`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>5</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}6`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>6</span>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}7`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>7</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}8`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>8</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}9`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>9</span>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="input-button">
          <button onClick={() => insert((prev) => `${prev}0`)} type="button" className="btn btn-success btn-lg btn-block">
            <span>0</span>
          </button>
        </div>
        <div className="input-button">
          <button onClick={() => insert((prev) => (prev.match(/\./g)?.length >= 1 || prev.length === 0 ? prev : `${prev}.`))} type="button" className="btn btn-success btn-lg btn-block">
            <span>.</span>
          </button>
        </div>
        <div className="input-button delete">
          <button onClick={() => insert((prev) => prev.slice(0, -1))} type="button" className="btn btn-success btn-lg btn-block">
            <span>⌫</span>
          </button>
        </div>
      </div>
    </div>
  );
}

NumberPanel.propTypes = {
  insert: PropTypes.func.isRequired,
  children: PropTypes.node,
};

NumberPanel.defaultProps = {
  children: null,
};

export default NumberPanel;
