/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setDialog, resetDialog } from 'redux/slices/modalSlice';
import Loader from 'common/Loader';
import { time, parseJwt, filter as matchingOptions } from 'helpers/index';
import { users } from 'controllers/index';
import translate from 'assets/translation';

function Users() {
  const lang = useSelector((state) => state.application.lang);
  const { _id } = useMemo(() => parseJwt(localStorage.getItem('jwt')).data, []);
  const [usersList, setUsersList] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const deleteUser = async (id, idx) => {
    try {
      const result = await users.deleteUserById(id);
      if (!result) throw new Error('User hasn\'t been deleted!');
      const clearedArr = [...usersList];
      clearedArr.splice(idx, 1);
      setUsersList(clearedArr);
    } catch (error) {
      dispatch(setModal({ text: error.message }));
      dispatch(resetDialog());
    }
  };

  const editUser = (id) => {
    dispatch(resetDialog());
    dispatch(setDialog(['UserModal', id]));
  };

  useEffect(() => {
    users.getAllUsers()
      .then((response) => {
        setUsersList(response.data);
        console.log(response.data)
        setIsLoading(false);
      })
      .catch((error) => dispatch(setModal({ text: error.message })));
  }, []);

  return (
    <div className="position-relative">
      {
        isLoading ? <Loader /> : (
          <div className="users">
            <div className="modal-header">
              <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title" id="mySmallModalLabel">
                { translate[lang].Users }
              </h4>
            </div>
            <div className="modal-body" id="all_userss">
              <input onChange={(e) => setFilter(e.target.value.toLocaleLowerCase())} className="form-control search-input" placeholder={translate[lang].Search} />
              <table className="table table-bordered" id="userList">
                <thead>
                  <tr>
                    <th>{ translate[lang].Name }</th>
                    <th>{ translate[lang].Rights }</th>
                    <th>{ translate[lang].Status }</th>
                    <th>{ translate[lang].Action }</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    usersList.map((user, idx) => user._id !== _id && matchingOptions(user.username, filter) && (
                      <tr key={user._id}>
                        <td className="vertical-middle">{user.username}</td>
                        <td className="vertical-middle">{ user.admin ? 'Admin' : 'Cashier' }</td>
                        <td className="vertical-middle btn-default">
                          {`Logged In: ${user.loggedIn ? time(new Date(user.loggedIn)) : 'User haven\'t logged in yet'}`}
                          <br />
                          {`Logged Out: ${user.loggedOut ? time(new Date(user.loggedOut)) : 'User haven\'t logged out yet'}`}
                        </td>
                        <td className="vertical-middle">
                          <span className="btn-group w-100">
                            <button onClick={() => editUser(user)} className="btn btn-dark" type="button"><i className="fa fa-edit" /></button>
                            <button onClick={() => deleteUser(user._id, idx)} className="btn btn-dark" type="button"><i className="fa fa-trash" /></button>
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Users;
