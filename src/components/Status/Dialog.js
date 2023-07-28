/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetDialog } from "redux/slices/modalSlice";
import PaymentMethod from "components/Dialog/PaymentMethod";
import NewCostumer from "components/Dialog/NewCostumer";
import NewCategory from "components/Dialog/NewCategory";
import NewProduct from "components/Dialog/NewProduct";
import Products from "components/Dialog/Products";
import Users from "components/Dialog/Users";
import UserModal from "components/Dialog/UserModal";
import HoldOrders from "components/Dialog/HoldOrders";
import SettingsModal from "components/Dialog/SettingsModal/SettingsModal";
import CloseApp from "components/Dialog/CloseApp";
import Categories from "components/Dialog/Categories";
import Confirm from "components/Dialog/Confirm";
import Critical from "components/Dialog/Critical";
import Alert from "components/Dialog/Alert";
import Cash from "components/Dialog/Cash";
import Check from "components/Dialog/Check";

function Dialog() {
  const [modal, settings] = useSelector((state) => state.modal.dialog);
  const dispatch = useDispatch();
  const wrapper = useRef(null);

  useEffect(() => {
    wrapper.current.onclick = (e) => {
      const path = e.composedPath ? e.composedPath() : e.path;

      const s = path.some((cur) => {
        if (cur instanceof HTMLElement) {
          return cur.classList.contains("modal-dialog");
        }
        return false;
      });

      if (!s) {
        dispatch(resetDialog());
      }
    };
  }, []);

  return (
    <div
      className={`modal fade d-b ${modal ? "show" : "z-negative"}`}
      ref={wrapper}
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          {modal === "Confirm" && <Confirm settings={settings} />}
          {modal === "PaymentMethod" && (
            <PaymentMethod paymentData={settings} />
          )}
          {modal === "NewCostumer" && <NewCostumer />}
          {modal === "NewCategory" && <NewCategory updateCategory={settings} />}
          {modal === "NewProduct" && <NewProduct product={settings} />}
          {modal === "Products" && <Products />}
          {modal === "Users" && <Users />}
          {modal === "UserModal" && <UserModal arg={settings} />}
          {modal === "HoldOrders" && <HoldOrders />}
          {modal === "SettingsModal" && <SettingsModal />}
          {modal === "CloseApp" && <CloseApp />}
          {modal === "Categories" && <Categories />}
          {modal === "Critical" && <Critical error={settings} />}
          {modal === "Alert" && <Alert />}
          {modal === "Cash" && <Cash settings={settings} />}
          {modal === "Check" && <Check />}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
