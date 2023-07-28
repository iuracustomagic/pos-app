import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'common/Loader';

function Loading({ status }) {
  return (
    <div className="loading-layout">
      <Loader />
      <div className="loading-message">
        {
          status
        }
      </div>
    </div>
  );
}

Loading.propTypes = {
  status: PropTypes.string,
};

Loading.defaultProps = {
  status: '',
};

export default Loading;
