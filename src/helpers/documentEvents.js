/* eslint-disable no-multi-assign */
/* eslint-disable radix */
import { getProductIfString } from "helpers";
import constrants from "assets/constrants";
let clickEvent = false;
let focusEvent = false;
let scan = "";

let timeout = setTimeout(() => {
  window.location.reload();
}, constrants.timeToQuit);

export default (
  dispatch,
  addProduct,
  editState,
  setModal,
  setShowKeyboard,
  setCollapse
) => {
  if (!window.api?.isAd) {
    document.onkeydown = (e) => {
      if (parseInt(e.key) >= 0 && window.location.pathname === "/layout") {
        if (!scan.length) {
          setTimeout(async () => {
            if (scan.length > 3) {
              const result = await getProductIfString(scan);
              scan = "";

              if (result === false) {
                dispatch(setModal({ text: "Can't find this product!" }));
                return;
              }

              if (result.product) {
                dispatch(addProduct(result));
                return;
              }

              if (result.discount) {
                dispatch(
                  editState({ type: "discount", discount: result.discount })
                );
              }
            }
          }, constrants.timeToScan);
        }

        scan += e.key;
        return;
      }
      scan = "";
    };

    document.onclick = (event) => {
      const path = event.composedPath ? event.composedPath() : event.path;

      const s = path.some((cur) => {
        if (cur instanceof HTMLElement) {
          return (
            cur.classList.contains("user-collapse") ||
            cur.classList.contains("fiscal-button")
          );
        }
        return false;
      });

      if (!s) {
        setCollapse(false);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        window.location.reload();
      }, constrants.timeToQuit);
    };

    document.addEventListener("focusin", (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        dispatch(setShowKeyboard(true));

        const attachFocus = () => {
          if (focusEvent) {
            event.target.focus();
          }
        };

        if (!focusEvent) {
          event.target.addEventListener("focusout", attachFocus, true);
          focusEvent = true;
        }

        const focusCheck = (fEvent) => {
          const path = fEvent.composedPath
            ? fEvent.composedPath()
            : fEvent.path;

          const s =
            fEvent.target.tagName === "INPUT" ||
            fEvent.target.tagName === "TEXTAREA" ||
            path.some((cur) => {
              if (cur instanceof HTMLElement) {
                return cur.classList.contains("keyboard");
              }
              return false;
            });

          if (!s) {
            dispatch(setShowKeyboard(false));
            focusEvent = clickEvent = false;
            document.removeEventListener("click", focusCheck, true);
            event.target.removeEventListener("focusout", attachFocus, true);
            event.target.blur();
          }
        };

        if (!clickEvent) {
          document.addEventListener("click", focusCheck, true);
          clickEvent = true;
        }
      }
    });
  }
};
