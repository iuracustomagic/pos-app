import React from 'react';
import { useSelector } from 'react-redux';

function Version() {
  const version = useSelector((state) => state.application.version);

  return (
    <div className="version-info">
      <span>{ version }</span>
    </div>
  );
}

export default Version;
