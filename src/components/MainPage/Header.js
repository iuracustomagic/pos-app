/* eslint-disable no-new */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from 'redux/slices/modalSlice';
import { setLang } from 'redux/slices/applicationSlice';
import PropTypes from 'prop-types';
import translation from 'assets/translation';
import HeaderButtons from './Header/HeaderButtons';
import UserPart from './Header/UserPart';

function Header({ collapseHeader, mode }) {
  const lang = useSelector((state) => state.application.lang);
  const issues = useSelector((state) => state.state.issues);
  const errors = useSelector((state) => state.state.errors);
  const dispatch = useDispatch();

  const changeLang = useCallback((language) => {
    localStorage.setItem('lang', language);
    dispatch(setLang(language));
  }, []);

  return (
    <div className={`main-topnav ${mode ? 'active' : ''}`}>
      <div className="controller-buttons">
        <HeaderButtons />
        <UserPart />
      </div>
      <div className="static-topnav">
        {
          issues.length || errors.length ? (
            <button onClick={() => dispatch(setDialog(['Alert']))} style={{ position: 'relative' }} className="btn btn-transparent" type="button">
              <div className="programm-issues">{ issues.length + errors.length }</div>
              <i className="fa fa-bell-o" aria-hidden="true" />
            </button>
          ) : null
        }
        <div className="dropdown-left language-option">
          <button className="btn btn-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            { lang.toUpperCase() }
          </button>
          <ul className="dropdown-menu">
            {
              Object.keys(translation).map((language) => <li key={language}><button onClick={() => changeLang(language)} type="button" className="dropdown-item">{language.toUpperCase()}</button></li>)
            }
          </ul>
        </div>
        <div className={`${!mode ? 'active' : 'disabled'} burger-menu`}>
          <button onClick={collapseHeader} type="button">
            <div className="burger">
              <div className="burger-lines" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  collapseHeader: PropTypes.func.isRequired,
  mode: PropTypes.bool.isRequired,
};

export default Header;
