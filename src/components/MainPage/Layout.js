/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDialog, resetDialog, setModal } from "redux/slices/modalSlice";
import {
  setApplicationSettings,
  setShowKeyboard
} from "redux/slices/applicationSlice";
import { editState } from "redux/slices/productSlice";
import { settings } from "controllers/index";
import Error from "components/Status/Error";
import Version from "common/Version";
import Header from "./Header";
import { Content } from "./Content";

function Layout() {
  const [headerState, setHeaderState] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const blur = useSelector((state) => state.modal.dialogBlur);
  const issues = useSelector((state) => state.state.issues);
  const errors = useSelector((state) => state.state.errors);
  const cart = useSelector((state) => state.product.cart);
  const app = useSelector((state) => state.application.applicationSettings);
  const [modal] = useSelector((state) => state.modal.dialog);
  const dispatch = useDispatch();

  const collapseHeader = useCallback(() => {
    setHeaderState((prev) => !prev);
  }, []);

  useEffect(() => {
    if (settingsLoaded && app.loaded !== false) {
      switch (true) {
        case !app?.store_name:
        case !app?.first_adress:
        case !app?.currency:
        case !app?.connectedDevices?.fiscal?.model &&
          process.env.NODE_ENV === "production":
        case !app?.connectedDevices?.fiscal?.version &&
          process.env.NODE_ENV === "production":
          dispatch(resetDialog());

          setTimeout(() => {
            dispatch(setDialog(["SettingsModal"]));
          }, 800);
          break;
        default:
      }
    }
  }, [settingsLoaded, modal]);

  useEffect(() => {
    const controller = new AbortController();

    settings.getSettings(controller.signal).then((result) => {
      if (result?.status !== 200) {
        dispatch(
          setModal({
            text: result?.data || "Error while trying to fetch settings"
          })
        );

        setSettingsLoaded(true);
        return;
      }

      dispatch(
        setApplicationSettings({
          ...result.data,
          connectedDevices: {
            fiscal: result.data?.connectedDevices?.fiscal || {},
            terminal: result.data?.connectedDevices?.terminal || [],
            display: result.data?.connectedDevices?.display || {}
          }
        })
      );

      dispatch(
        editState({
          type: "sum",
          sum: cart.reduce((prev, cur) => prev + cur.countedPrice, 0)
        })
      );

      setSettingsLoaded(true);
    });

    dispatch(setShowKeyboard(false));

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="layout" style={{ filter: blur ? "blur(1px)" : "" }}>
      {errors.length ? (
        <Error errors={errors} issues={issues} />
      ) : (
        <>
          <Version />
          <Header collapseHeader={collapseHeader} mode={headerState} />
          <Content />
        </>
      )}
    </div>
  );
}

export default Layout;
