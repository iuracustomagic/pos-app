import React, { useCallback } from 'react';

function RefreshConnection() {
  const refresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="btn-group header-complex-btns">
      <button onClick={refresh} className="btn btn-default waves-effect waves-light" type="button">
        <span className="btn-label">
          <i className="fa fa-refresh" aria-hidden="true" />
        </span>
        Refresh connection
      </button>
    </div>
  );
}

export default RefreshConnection;
