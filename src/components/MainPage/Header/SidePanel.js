import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setDialog, resetDialog, toggleSidePanel } from 'redux/slices/modalSlice';
import translation from 'assets/translation';
import { printReport as fiscalReport } from 'helpers/index';

const { ipcRenderer } = window.require
  ? window.require('electron')
  : { ipcRenderer: { send: () => {}, on: () => {} } };

function SidePanel() {
  const collapse = useSelector((state) => state.modal.collapseSidePanel);
  const lang = useSelector((state) => state.application.lang);
  const device = useSelector((state) => state.state.initializedDevices);
  const hold = useSelector((state) => state.product.hold);
  const dispatch = useDispatch();

  const report = useCallback((arg) => {
    if (hold.length) {
      dispatch(setModal({ text: 'Please remove every check from hold!' }));
      return;
    }

    dispatch(setDialog(['Confirm', arg]));
  }, []);

  const cashOut = useCallback((sum) => {
    ipcRenderer.send('cash', { sum, type: 'cashOut' });
  }, []);

  const cashIn = useCallback((sum) => {
    ipcRenderer.send('cash', { sum, type: 'cashIn' });
  }, []);

  useEffect(() => {
    ipcRenderer.on('cash', (event, message) => {
      if (message) {
        dispatch(resetDialog());
        dispatch(setModal({ text: 'Operation completed successfully', status: true }));
        return;
      }
      dispatch(setModal({ text: 'Runtime error' }));
    });
  }, []);

  return (
    <div className={`user-collapse bg-light ${collapse ? 'active' : ''}`}>
      <button className="d-block btn btn-default waves-effect waves-light" onClick={() => dispatch(toggleSidePanel(false))} type="button">
        <span className="hide-side-fiscal">
          { translation[lang].Hide }
        </span>
        <span>
          <i className="fa fa-arrow-right" />
        </span>
      </button>
      <ul className="nav nav-pills flex-column mb-auto">
        {
          device.fiscal?.status ? (
            <>
              <li>
                <button
                  onClick={() => report({ action: fiscalReport, description: 'You are about to print Z report.', args: ['Z'] })}
                  type="button"
                  className="nav-link link-dark"
                >
                  <span className="btn-label">
                    <i className="fa fa-file-text-o" aria-hidden="true" />
                  </span>
                  <span>
                    { translation[lang]['Print Z report'] }
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => fiscalReport(['X'])}
                  type="button"
                  className="nav-link link-dark"
                >
                  <span className="btn-label">
                    <i className="fa fa-file-text-o" aria-hidden="true" />
                  </span>
                  <span>
                    { translation[lang]['Print X report'] }
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { dispatch(setDialog(['Cash', { cb: cashOut, header: 'Cash out' }])); dispatch(toggleSidePanel(false)); }}
                  type="button"
                  className="nav-link link-dark"
                >
                  <span className="btn-label">
                    <i className="fa fa-money" />
                  </span>
                  <span>
                    { translation[lang]['Cash out'] }
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { dispatch(setDialog(['Cash', { cb: cashIn, header: 'Cash in' }])); dispatch(toggleSidePanel(false)); }}
                  type="button"
                  className="nav-link link-dark"
                >
                  <span className="btn-label">
                    <i className="fa fa-money" aria-hidden="true" />
                  </span>
                  <span>
                    { translation[lang]['Cash in'] }
                  </span>
                </button>
              </li>
            </>
          ) : null
        }
      </ul>
    </div>
  );
}

export default SidePanel;
