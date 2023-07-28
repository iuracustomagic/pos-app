/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "application",
  initialState: {
    lang: localStorage.getItem("lang") || "en",
    currentVersion: null,
    showKeyboard: false,
    display: [],
    listDevices: {},
    issues: [],
    applicationSettings: { loaded: false },
    versionsAvailable: []
  },
  reducers: {
    setListDevices(state, { payload }) {
      state.listDevices = payload;
    },
    setLang(state, { payload }) {
      state.lang = payload;
    },
    setDisplay(state, { payload }) {
      state.display = payload;
    },
    setApplicationSettings(state, { payload }) {
      state.applicationSettings = payload;
    },
    setAvailableVersions(state, { payload }) {
      state.setAvailableVersions = payload;
    },
    setCurrentVersion(state, { payload }) {
      state.currentVersion = payload;
    },
    setShowKeyboard(state, { payload }) {
      state.showKeyboard = payload;
    }
  }
});

export default slice.reducer;
export const {
  setListDevices,
  setLang,
  setDisplay,
  setApplicationSettings,
  setAvailableVersions,
  setCurrentVersion,
  setShowKeyboard
} = slice.actions;
