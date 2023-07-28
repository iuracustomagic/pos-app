import React from "react";
import PropTypes from "prop-types";
import SettingButton from "components/MainPage/Header/SettingButton";
import RefreshConnection from "components/MainPage/Header/RefreshConnection";
import TurnOffButton from "components/MainPage/Header/TunrOffButton";

function Error({ errors, issues }) {
  return (
    <div className="error-layout">
      <div className="topnav">
        <RefreshConnection />
        <SettingButton className="btn-default settings" />
        <TurnOffButton className="btn-default turn-off" />
      </div>
      <div className="error-container">
        {errors.length ? (
          <div className="critical">
            <h4>Critical: </h4>
            {errors.map((cur) => (
              <pre>{cur}</pre>
            ))}
          </div>
        ) : null}
        {issues.length ? (
          <div className="warnings">
            <h4>Warnings: </h4>
            {issues.map((cur) => (
              <pre>{cur}</pre>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

Error.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.objectOf({
      message: PropTypes.string
    })
  ).isRequired,
  issues: PropTypes.arrayOf(PropTypes.string)
};

Error.defaultProps = {
  issues: []
};

export default Error;
