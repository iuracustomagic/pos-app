/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'state',
  initialState: {
    toggleUpdateProducts: false,
    initialized: false,
    payment: false,
    errors: [],
    issues: [],
    initializedDevices: {
      terminal: [],
    },
  },
  reducers: {
    setInitializedDevices(state, { payload }) {
      if (payload.terminal) {
        state.initializedDevices.terminal = [...state.initializedDevices.terminal, payload.terminal];
        return;
      }

      state.initializedDevices = { ...state.initializedDevices, ...payload };
    },
    setInitialized(state, { payload }) {
      state.initialized = payload;
    },
    setPayment(state, { payload }) {
      state.payment = payload;
    },
    setError(state, { payload }) {
      state.errors.push(payload);
    },
    setIssues(state, { payload }) {
      state.issues.push(payload);
    },
    updateProducts(state) {
      state.toggleUpdateProducts = !state.toggleUpdateProducts;
    },
  },
});

export default slice.reducer;
export const {
  setInitializedDevices,
  setInitialized,
  setPayment,
  setError,
  setIssues,
  updateProducts,
} = slice.actions;
