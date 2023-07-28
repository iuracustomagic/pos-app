import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from 'redux/slices/modalSlice';
import { parseJwt } from 'helpers/index';
import translate from 'assets/translation';
import { useNavigate } from 'react-router-dom';

function HeaderButtons() {
  const { admin, manager } = useMemo(() => (parseJwt(localStorage.getItem('jwt')).data), []);
  const lang = useSelector((state) => state.application.lang);
  const app = useSelector((state) => state.application.applicationSettings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="button-list pull-left m-t-15">
      {
        (admin && app.display) && (
          <>
            <div className="btn-group header-complex-btns">
              <button onClick={() => dispatch(setDialog(['Products']))} type="button" className="btn btn-default">
                <span className="btn-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-upc" viewBox="0 0 16 16">
                    <path d="M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
                  </svg>
                </span>
                { translate[lang].Products }
              </button>
              <button onClick={() => dispatch(setDialog(['NewProduct']))} type="button" className="btn btn-warning">
                <i className="fa fa-plus" />
              </button>
            </div>
            <div className="btn-group header-complex-btns">
              <button onClick={() => dispatch(setDialog(['Categories']))} type="button" className="btn btn-default waves-effect waves-light">
                <span className="btn-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-3x3-gap-fill" viewBox="0 0 16 16">
                    <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z" />
                  </svg>
                </span>
                { translate[lang].Categories }
              </button>
              <button onClick={() => dispatch(setDialog(['NewCategory']))} type="button" className="btn btn-warning">
                <i className="fa fa-plus" />
              </button>
            </div>
            <div className="btn-group">
              <button onClick={() => dispatch(setDialog(['Users']))} type="button" className="btn btn-default">
                <span className="btn-label">
                  <svg style={{ marginTop: '-3px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                { translate[lang].Users }
              </button>
              <button onClick={() => navigate('/registration')} type="button" className="btn btn-warning">
                <i className="fa fa-plus" />
              </button>
            </div>
          </>
        )
      }
      {
        manager && (
          <div className="btn-group">
            <button onClick={() => dispatch(setDialog(['Check']))} type="button" className="btn btn-default">
              <span className="btn-label">
                <i className="fa fa-check" />
              </span>
              { translate[lang]['Check return'] }
            </button>
          </div>
        )
      }
    </div>
  );
}

export default HeaderButtons;
