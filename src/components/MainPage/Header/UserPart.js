/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDialog, toggleSidePanel } from "redux/slices/modalSlice";
import translation from "assets/translation";
import { parseJwt } from "helpers";
import SettingButton from "./SettingButton";
import SidePanel from "./SidePanel";

function UserPart() {
  const { username, admin } = useMemo(
    () => parseJwt(localStorage.getItem("jwt")).data,
    []
  );
  const lang = useSelector((state) => state.application.lang);
  const settingsLoaded = useSelector(
    (state) => state.application.applicationSettings.loaded
  );
  const device = useSelector((state) => state.state.initializedDevices);
  const dispatch = useDispatch();

  return (
    <div className="button-list pull-right m-t-15 user-settings">
      {admin && (
        <>
          <button
            onClick={() => dispatch(setDialog(["UserModal"]))}
            type="button"
            className="btn btn-grey"
          >
            <span className="btn-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            </span>
            <span>{username || translation[lang].User}</span>
          </button>
          {device.fiscal?.status ? (
            <button
              onClick={() => dispatch(toggleSidePanel(true))}
              className="btn btn-grey fiscal-button"
              type="button"
            >
              <span className="btn-label">
                <i className="fa fa-print" aria-hidden="true" />
              </span>
              <span>{translation[lang].Printer}</span>
            </button>
          ) : null}
        </>
      )}
      {settingsLoaded === false ? null : (
        <SettingButton className="btn-transparent" />
      )}
      <SidePanel />
    </div>
  );
}

export default UserPart;
