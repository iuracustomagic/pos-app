/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "modal",
  initialState: {
    modal: [],
    dialog: [],
    collapseSidePanel: false,
    dialogBlur: false
  },
  reducers: {
    setModal(state, { payload }) {
      state.modal.push({ ...payload, modal: true });
    },
    resetModal(state) {
      state.modal.shift();
    },
    setDialog(state, { payload }) {
      state.dialog = payload;
      state.dialogBlur = true;
    },
    resetDialog(state) {
      state.dialog = [];
      state.dialogBlur = false;
    },
    toggleSidePanel(state, { payload }) {
      state.collapseSidePanel = payload;
    }
  }
});

export const { setModal, resetModal, setDialog, resetDialog, toggleSidePanel } =
  slice.actions;
export default slice.reducer;
