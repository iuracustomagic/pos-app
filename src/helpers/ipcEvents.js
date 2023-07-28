import { deviceInitialization, refresh } from "helpers/ipc";
import {
  setListDevices,
  setAvailableVersions,
  setCurrentVersion,
  setDisplay
} from "redux/slices/applicationSlice";
import {
  setError,
  setInitializedDevices,
  setIssues,
  updateProducts,
  setInitialized
} from "redux/slices/stateSlice";

export default (dispatch, setInitializationStatus, version) => {
  const { ipcRenderer } = window.require("electron");

  ipcRenderer.send("window-rendered", true);
  ipcRenderer.on("initialization-status", (evt, message) => {
    setInitializationStatus(message);
  });
  ipcRenderer.on("fetch-products", () => {
    dispatch(updateProducts());
  });
  ipcRenderer.on("version", (evt, message) => {
    dispatch(setCurrentVersion(message));
    dispatch(
      setAvailableVersions((prev) =>
        prev.filter((cur) => cur.name !== `v${message}`)
      )
    );
  });
  ipcRenderer.on("device-settings", (evt, message) => {
    dispatch(setListDevices(message));
  });
  ipcRenderer.on("update-versions", (evt, message) => {
    dispatch(
      setAvailableVersions(message.filter((cur) => cur.name !== `v${version}`))
    );
  });
  ipcRenderer.on("display-ad-images", (evt, message) => {
    dispatch(setDisplay(message));
  });
  ipcRenderer.on("refresh", refresh);
  ipcRenderer.on("initialization", (evt, message) => {
    deviceInitialization(evt, message, {
      setInitialized: () => {
        dispatch(setInitialized(true));
      },
      setError: (value) => {
        dispatch(setError(value));
      },
      setDevice: (device) => {
        dispatch(setInitializedDevices(device));
      },
      setIssues: (issue) => {
        dispatch(setIssues(issue));
      }
    });
  });
};
