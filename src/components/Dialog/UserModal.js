/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, resetDialog } from 'redux/slices/modalSlice';
// import Loader from 'common/Loader';
import PropTypes from 'prop-types';
import { users } from 'controllers/index';
// import { parseJwt } from 'helpers/index';
import translate from 'assets/translation';
import Permissions from 'common/Permissions';
import {parseJwt} from "../../helpers";

function UserModal({ arg }) {
  const { _id } = useMemo(() => parseJwt(localStorage.getItem('jwt')).data, []);
  const lang = useSelector((state) => state.application.lang);
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  const [sendData, setSendData] = useState(arg);

  const getRights = (element) => {
    setSendData((prev) => ({ ...prev, ...element }));
  };

  const quit = async () => {
    try {
      const result = await users.logout(_id);
      if (result.status !== 200) throw new Error('Error durring the logout');
      localStorage.removeItem('jwt');
      dispatch(resetDialog());
      window.location.pathname = '/';
    } catch (err) {
      dispatch(setModal({ text: err.message }));
    }
  };

  const saveUser = async () => {
    try {
      console.log('sendData after saveUser',sendData)
      const result = await users.update(sendData);
      if (result.status !== 200) throw new Error(result.data);
      dispatch(setModal({ text: 'Data has been updated', status: true }));
      if (!arg) localStorage.setItem('jwt', result.data);
      dispatch(resetDialog());
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  useEffect(() => {
    // console.log('username', name)
    console.log('arg', arg)
    // inputRef.current.value = arg.username;
    // if (!arg) {
    //   setIsLoading(false);
    //   return;
    // }

    // users.getUserById(arg)
    //   .then((response) => {
    //     setSendData({id: response._id, username: response.username});
    //     console.log('sendData', sendData)
    //     // setName(response.username)
    //     setIsLoading(false);
    //   });
  }, []);

  return (
    <div className="user-modal">
            <div className="modal-header">
              <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title" id="mySmallModalLabel">
                { translate[lang]['Account Information'] }
              </h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="userName">{ translate[lang].Name }</label>
                <input id="userName" ref={inputRef} onChange={(e) => setSendData((prev) => ({ ...prev, username: e.target.value }))}
                       value={sendData.username} type="text"
                       placeholder="Enter user name" className="form-control" />


              </div>
              {
                arg ? (
                  <Permissions getRights={getRights} rights={{ admin: arg.admin, manager: arg.manager, superadmin: arg.superadmin }} />
                ) : null
              }
              <div className="d-flex mt-4">
                <button onClick={saveUser} className="btn btn-primary" type="button">{ translate[lang].Save }</button>
                {_id === arg._id && (
                    <button onClick={quit} type="button" className="btn btn-default waves-effect waves-light">
                  <span className="btn-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                      <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                    </svg>
                  </span>
                      <span className="btn-label-text">
                    { translate[lang].Logout }
                  </span>
                    </button>
                )}

              </div>
            </div>
    </div>
  );
}
//  onClick={() => dispatch(setDialog(['Confirm', { action: quit, description: 'You are about to log out.' }]))}

UserModal.propTypes = {
  arg: PropTypes.string,
};

UserModal.defaultProps = {
  arg: undefined,
};

export default UserModal;


