import { combineReducers, configureStore } from "@reduxjs/toolkit";
import modalSlice from "./slices/modalSlice";
import productSlice from "./slices/productSlice";
import applicationSlice from "./slices/applicationSlice";
import stateSlice from "./slices/stateSlice";

const rootReducer = combineReducers({
  product: productSlice,
  modal: modalSlice,
  application: applicationSlice,
  state: stateSlice
});

export const store = configureStore({
  reducer: rootReducer
});
