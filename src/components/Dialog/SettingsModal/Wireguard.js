/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModal } from 'redux/slices/modalSlice';
import { sendWgSettings } from 'helpers/ipc';

const { ipcRenderer } = window.require
  ? window.require('electron')
  : { ipcRenderer: { send: () => {}, on: () => {} } };

function Wireguard() {
  const dispatch = useDispatch();
  const [wgSettings, setWgSettings] = useState({
    Interface: {},
    Peer: {},
  });

  const applyWgSettings = () => {
    sendWgSettings(wgSettings, ipcRenderer, (result) => {
      dispatch(setModal({ state: result }));
    });
  };

  return (
    <div className="d-flex">
      <div className="col-md-6">
        <div className="form-group">
          <label>Private Key</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Interface: { ...wgSettings.Interface, PrivateKey: e.target.value } })} className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Interface: { ...wgSettings.Interface, Address: e.target.value } })} className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>MTU</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Interface: { ...wgSettings.Interface, MTU: e.target.value } })} className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>DNS</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Interface: { ...wgSettings.Interface, DNS: e.target.value } })} className="form-control" type="text" />
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label>PresharedKey</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Peer: { ...wgSettings.Peer, PresharedKey: e.target.value } })} className="form-control" type="text" />
        </div>
        <div className="form-group">
          <label>PublicKey</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Peer: { ...wgSettings.Peer, PublicKey: e.target.value } })} className="form-control" />
        </div>
        <div className="form-group">
          <label>AllowedIPs</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Peer: { ...wgSettings.Peer, AllowedIPs: e.target.value } })} className="form-control" />
        </div>
        <div className="form-group">
          <label>Endpoint</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Peer: { ...wgSettings.Peer, Endpoint: e.target.value } })} className="form-control" />
        </div>
        <div className="form-group">
          <label>PersistentKeepalive</label>
          <input onChange={(e) => setWgSettings({ ...wgSettings, Peer: { ...wgSettings.Peer, PersistentKeepalive: e.target.value } })} className="form-control" />
        </div>
        <div className="form-group">
          <button onClick={applyWgSettings} className="btn btn-danger mt-2 float-right" type="button">Save wireguard settings</button>
        </div>
      </div>
    </div>
  );
}

export default Wireguard;
