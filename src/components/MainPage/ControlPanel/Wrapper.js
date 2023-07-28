/* eslint-disable import/no-cycle */
import React from 'react';
import ScanInput from './ScanInput';
import Table from './Table';
import Bills from './Bills';
import ControlButtons from './ControlButtons';

function Wrapper() {
  return (
    <div className="col-md-4 check">
      <div className="card-box">
        <ScanInput />
        <Table />
        <Bills />
        <ControlButtons />
      </div>
    </div>
  );
}

export default Wrapper;
