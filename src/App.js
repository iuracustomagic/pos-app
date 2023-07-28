/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KeyboardReact from "react-simple-keyboard";
import { addProduct, editState } from "redux/slices/productSlice";
import { setModal, toggleSidePanel } from "redux/slices/modalSlice";
import { setDisplay, setShowKeyboard } from "redux/slices/applicationSlice";
import { setInitialized } from "redux/slices/stateSlice";
import { setValueFromKeyboard } from "helpers";
import documentEvents from "helpers/documentEvents";
import ipcEvents from "helpers/ipcEvents";
import Loading from "./components/Status/Loading";
import Login from "./components/Login";
import Layout from "./components/MainPage/Layout";
import Registration from "./components/Registration";
import Modal from "./components/Status/Modal";
import Dialog from "./components/Status/Dialog";
import "./styles/styles";

function App() {
  const [ad, setAd] = useState(false);
  const [adIsLoaded, setAdIsLoaded] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState("");
  const [shift, setShift] = useState("default");
  const initialized = useSelector((state) => state.state.initialized);
  const version = useSelector((state) => state.application.currentVersion);
  const display = useSelector((state) => state.application.display);
  const showKeyboard = useSelector((state) => state.application.showKeyboard);
  const AdComponent = useRef(null);
  const dispatch = useDispatch();

  const loadComponent = async () => {
    AdComponent.current = (await import("./components/Ad")).default;

    setAdIsLoaded(true);
  };

  useEffect(() => {
    documentEvents(
      dispatch,
      addProduct,
      editState,
      setModal,
      setShowKeyboard,
      (value) => {
        dispatch(toggleSidePanel(value));
      }
    );

    if (process.env.NODE_ENV === "development") {
      dispatch(setInitialized(true));
      return;
    }

    if (window.api) {
      setAd(true);
      loadComponent();
      dispatch(setInitialized(true));

      window.api.send("ad-window-rendered", true);
      window.api.receive("display-ad-images", (message) => {
        dispatch(setDisplay(message));
      });
      return;
    }

    ipcEvents(dispatch, setInitializationStatus, version);
  }, []);

  return (
    <>
      {!initialized ? (
        <Loading status={initializationStatus} />
      ) : ad ? (
        adIsLoaded && <AdComponent.current display={display} />
      ) : (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/layout" element={<Layout />} />
            </Routes>
          </Router>
          <Modal />
          <Dialog />
          <div className={`keyboard ${showKeyboard ? "show-keyboard" : ""}`}>
            <KeyboardReact
              onKeyPress={(w) => {
                setValueFromKeyboard(w, setShift);
              }}
              layoutName={shift}
            />
          </div>
        </>
      )}
    </>
  );
}

export default App;
