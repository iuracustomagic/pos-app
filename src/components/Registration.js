/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { parseJwt } from 'helpers/index';
import { setModal } from 'redux/slices/modalSlice';
import { setShowKeyboard } from 'redux/slices/applicationSlice';
import translate from 'assets/translation';
import Permissions from 'common/Permissions';
import { users } from '../controllers/index';

function Registration() {
  const [code, setCode] = useState('');
  const [state, setState] = useState(false);
  const [permission, setPermission] = useState({});
  const [username, setUsername] = useState('');
  const lang = useSelector((store) => store.application.lang);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getRights = (element) => setPermission(element);

  const registerUser = useCallback(async () => {
    try {
      console.log(code.length)
      if (code.length === 13) {
        const jwt = await users.register({ code, username, ...permission });
        if (jwt.response.status !== 200) throw new Error(jwt.data || jwt.response.data || 'Error while registering');
        dispatch(setModal({ state: true }));
        return;
      }
      setState(true);
    } catch (error) {
      dispatch(setModal({ text: error.message || 'Something went wrong while authorization' }));
    }
  }, []);

  useEffect(() => {
    if (code.length === 13) setState(false);
  }, [code]);

  useEffect(() => {
    if (!parseJwt(localStorage.getItem('jwt')).data.admin
     && !parseJwt(localStorage.getItem('jwt')).data.superadmin) navigate(-1);

    dispatch(setShowKeyboard(false));
  }, []);

  return (
    <div className="registration-container">
      <div className="links">
        <Link className="link" to="/">{ translate[lang]['Back to Login'] }</Link>
        <Link className="link" to="#" onClick={() => navigate(-1)}>{ translate[lang]['Go Back'] }</Link>
      </div>
      <div className="fields-container">
        <h2>{ translate[lang]['Register a new user'] }</h2>
        <div className={`form-container ${state ? 'was-validated' : 'needs-validate'}`}>
          <input
            className="form-control"
            placeholder={translate[lang].Code}
            onChange={(e) => { setCode(e.target.value); }}
            value={code}
          />
          <input
            className="form-control"
            placeholder={translate[lang]['Username (Optional)']}
            onChange={(e) => { setUsername(e.target.value); }}
            value={username}
          />
          <div className="invalid-feedback">
            { translate[lang]['Code must contains 13 digits.'] }
          </div>
          <Permissions getRights={getRights} rights={false} />
          <button type="button" className="btn btn-primary mt-3" onClick={registerUser}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Registration;
