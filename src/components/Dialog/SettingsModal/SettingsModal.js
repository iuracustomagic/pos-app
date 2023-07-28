import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, resetDialog } from "redux/slices/modalSlice";
import translate from "assets/translation";
import { settings } from "controllers/index";
import { parseJwt } from "helpers";
import TurnOffButton from "components/MainPage/Header/TunrOffButton";
import Main from "./Main";
import Fiscal from "./Fiscal";
import Terminal from "./Terminal";
import Display from "./Display";
import Wireguard from "./Wireguard";

function SettingsModal() {
  const { superadmin } = useMemo(
    () => parseJwt(localStorage.getItem("jwt")).data,
    []
  );
  const lang = useSelector((state) => state.application.lang);
  const display = useSelector((state) => state.application.display);
  const app = useSelector((state) => state.application.applicationSettings);
  const dispatch = useDispatch();
  const [mode, setMode] = useState(1);
  const [state, setState] = useState(false);
  const [com, setCom] = useState([]);
  const [sendData, setSendData] = useState({ ...app });
  const [images, setImages] = useState(display);
  const [unload, setUnload] = useState([]);
  const listDevices = useSelector((store) => store.application.listDevices);

  const available = useMemo(
    () => [
      ...["fiscal", "terminal", "display"].reduce(
        (prev, cur) => (listDevices[cur] ? [...prev, cur] : prev),
        []
      ),
      ...(superadmin ? ["wireguard"] : [])
    ],
    [listDevices]
  );

  const sendForm = async () => {
    try {
      if (
        !sendData?.store_name ||
        !sendData?.first_adress ||
        !sendData?.currency
      ) {
        if (!state) setState(true);
        if (mode !== 1) setMode(1);
        return;
      }

      if (process.env.NODE_ENV === "production") {
        if (
          !sendData?.connectedDevices?.fiscal?.version?.length ||
          !sendData?.connectedDevices?.fiscal?.model?.length
        ) {
          if (!state) setState(true);
          if (mode !== 2) setMode(2);
          return;
        }

        if (
          !sendData?.connectedDevices?.terminal?.every(
            (terminal) => terminal.version.length && terminal.model.length
          )
        ) {
          if (!state) setState(true);
          if (mode !== 3) setMode(3);
          return;
        }

        if (
          !sendData?.connectedDevices?.display?.version &&
          sendData?.connectedDevices?.display?.model
        ) {
          if (!state) setState(true);
          if (mode !== 4) setMode(4);
          return;
        }
      }

      const result = await settings.setSettings(
        { ...sendData, img: !!sendData.img },
        sendData.img
      );
      if (result.status !== 200) throw new Error(result);
      await settings.adImgs(unload);
      window.location.reload();
    } catch (error) {
      dispatch(
        setModal({
          text: error?.message ? error.message : "Something went wrong"
        })
      );
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("com", true);

      ipcRenderer.on("com", (evt, message) => {
        setCom(message.map((cur) => +cur.path.replace(/[^\d]/g, "")));
      });
    }
  }, []);

  return (
    <div className="settings-modal">
      <div className="modal-header">
        <div className="turn-off">
          <TurnOffButton className="btn-transparent" />
          <button
            onClick={() => {
              dispatch(resetDialog());
            }}
            type="button"
            className="close"
          >
            {app?.store_name && app?.first_adress && app?.currency ? "×" : null}
          </button>
        </div>
        <h4 className="modal-title">{translate[lang].Settings}</h4>
      </div>
      <div className="modal-body">
        <div className="form-group">
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav">
              <li className={`nav-item ${mode === 1 && "active"}`}>
                <button
                  onClick={() => setMode(1)}
                  className="nav-link"
                  aria-current="page"
                  type="button"
                >
                  {translate[lang]["Main Settings"]}
                </button>
              </li>
              {available.map((cur, idx) =>
                listDevices[cur] || cur === "wireguard" ? (
                  <li
                    className={`nav-item ${mode === idx + 2 && "active"}`}
                    key={`SettingsModal-${cur}`}
                  >
                    <button
                      onClick={() => setMode(idx + 2)}
                      className="nav-link"
                      aria-current="page"
                      type="button"
                    >
                      {translate[lang][cur]}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
        <div className="settings-content-container">
          <div
            style={{ transform: `translateX(-${mode * 750 - 750}px)` }}
            className="box"
          >
            <Main setSendData={setSendData} sendData={sendData} state={state} />
            {listDevices.fiscal ? (
              <Fiscal
                setSendData={setSendData}
                listDevices={listDevices}
                sendData={sendData}
                state={state}
                com={com}
              />
            ) : null}
            {listDevices.terminal ? (
              <Terminal
                setSendData={setSendData}
                listDevices={listDevices}
                sendData={sendData}
                state={state}
                com={com}
              />
            ) : null}
            {listDevices.display ? (
              <Display
                setSendData={setSendData}
                listDevices={listDevices}
                sendData={sendData}
                state={state}
                images={images}
                setImages={setImages}
                setUnload={setUnload}
              />
            ) : null}
            {superadmin && process.env.WIREGUARD ? <Wireguard /> : null}
          </div>
        </div>
        <div className="form-group mt-4">
          <button
            onClick={sendForm}
            type="button"
            className="btn btn-default btn-block waves-effect waves-light mt-2"
          >
            {translate[lang]["Save Settings"]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
