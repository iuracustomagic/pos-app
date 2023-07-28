/* eslint-disable object-curly-newline */
/* eslint-disable no-param-reassign */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetModal } from "redux/slices/modalSlice";
import constrants from "assets/constrants";
const { toggleModalInterval } = constrants;

function Modal() {
  const modalStore = useSelector((store) => store.modal.modal);
  const [modal, setModal] = useState();
  const [clearModal, setClearModal] = useState();
  const dispatch = useDispatch();

  const hideModal = () => {
    setModal((prev) => ({ ...prev, modal: false }));

    setTimeout(() => {
      setModal();
      dispatch(resetModal());
    }, 500);
  };

  const checkClick = (e) => {
    const path = e.composedPath ? e.composedPath() : e.path;

    if (path) {
      const s = path.some((cur) => {
        if (cur instanceof HTMLElement) {
          return cur.classList.contains("modal-dialog");
        }
        return false;
      });

      if (!s && !(e.path[0] instanceof HTMLButtonElement)) {
        clearTimeout(clearModal);
        setClearModal();
        hideModal();
      }
      return;
    }

    if (e.target.classList.contains("error-modal")) {
      clearTimeout(clearModal);
      setClearModal();
      hideModal();
    }
  };

  useEffect(() => {
    if (!modalStore.length) {
      return;
    }

    setModal((modalUpdated) => {
      if (!modalUpdated) {
        setClearModal(
          setTimeout(() => {
            hideModal();
          }, toggleModalInterval)
        );
        return modalStore[0];
      }
      return modalUpdated;
    });
  }, [modalStore, modal]);

  return (
    <button
      onClick={(e) => checkClick(e)}
      type="button"
      className="cursor-default"
    >
      <div
        className={`modal error-modal
          ${modal?.modal ? "show-modal" : ""}
          ${modal?.attention ? "attention" : ""}
          ${modal?.state ? "success" : ""}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content p-3">
            <div className="modal-header flex-row pb-2">
              <h5 className="modal-title">
                {modal?.state ? "Success" : "Error"}
              </h5>
            </div>
            <div className="modal-body py-2">
              <p className="m-0">
                {modal?.text?.length ? modal.text : "Error"}
              </p>
            </div>
          </div>
          <div className="svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#77dd77"
              viewBox="0 0 46.124 46.125"
              xmlSpace="preserve"
            >
              <g>
                <g>
                  <g>
                    <path d="M37.727,0.062H8.397C3.759,0.062,0,3.822,0,8.46v29.204c0,4.639,3.759,8.398,8.397,8.398h29.33     c4.637,0,8.397-3.76,8.397-8.398V8.46C46.125,3.822,42.365,0.062,37.727,0.062z M38.007,19.14L22.142,35.005     c-0.673,0.674-1.586,1.052-2.538,1.052s-1.865-0.379-2.538-1.052l-7.863-7.863c-1.401-1.402-1.401-3.674,0.001-5.077     c0.673-0.673,1.585-1.051,2.537-1.051c0.952,0,1.864,0.378,2.537,1.051l4.686,4.687c0.17,0.17,0.401,0.266,0.641,0.266     c0.24,0,0.471-0.096,0.641-0.266l12.686-12.687c0.674-0.673,1.586-1.052,2.539-1.052c0.951,0.001,1.864,0.379,2.537,1.052     C39.409,15.467,39.409,17.739,38.007,19.14z" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

export default Modal;
