/* eslint-disable react/no-unknown-property */
import React from 'react';
import { useDispatch } from 'react-redux';
import { resetDialog } from 'redux/slices/modalSlice';
import PropTypes from 'prop-types';

function Lodaer({ withoutClose }) {
  const dispatch = useDispatch();

  return (
    <div className="loader">
      {
        !withoutClose && <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
      }
      <h2>Loading...</h2>
      <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-lds-clock">
        <g transform="translate(50 50)">
          <g>
            <g transform="translate(-50 -50)">
              <path d="M50,14c19.85,0,36,16.15,36,36S69.85,86,50,86S14,69.85,14,50S30.15,14,50,14 M50,10c-22.091,0-40,17.909-40,40 s17.909,40,40,40s40-17.909,40-40S72.091,10,50,10L50,10z" fill="#f5076a" stroke="#f5076a" strokeWidth="3" />
              <path d="M52.78,42.506c-0.247-0.092-0.415-0.329-0.428-0.603L52.269,40l-0.931-21.225C51.304,18.06,50.716,17.5,50,17.5 s-1.303,0.56-1.338,1.277L47.731,40l-0.083,1.901c-0.013,0.276-0.181,0.513-0.428,0.604c-0.075,0.028-0.146,0.063-0.22,0.093V44h6 v-1.392C52.925,42.577,52.857,42.535,52.78,42.506z" fill="#00a1d5" transform="rotate(264 50 50)">
                <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="0.625s" begin="0s" repeatCount="indefinite" />
              </path>
              <path d="M58.001,48.362c-0.634-3.244-3.251-5.812-6.514-6.391c-3.846-0.681-7.565,1.35-9.034,4.941 c-0.176,0.432-0.564,0.717-1.013,0.744l-15.149,0.97c-0.72,0.043-1.285,0.642-1.285,1.383c0,0.722,0.564,1.321,1.283,1.363 l15.153,0.971c0.447,0.027,0.834,0.312,1.011,0.744c1.261,3.081,4.223,5.073,7.547,5.073c2.447,0,4.744-1.084,6.301-2.975 C57.858,53.296,58.478,50.808,58.001,48.362z M50,53.06c-1.688,0-3.06-1.373-3.06-3.06s1.373-3.06,3.06-3.06s3.06,1.373,3.06,3.06 S51.688,53.06,50,53.06z" fill="#00a1d5" transform="rotate(156 50 50)">
                <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="2.5s" begin="0s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

Lodaer.propTypes = {
  withoutClose: PropTypes.bool,
};

Lodaer.defaultProps = {
  withoutClose: undefined,
};

export default Lodaer;
