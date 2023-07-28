/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { products, categories } from "controllers";
import { addProduct, editState } from "redux/slices/productSlice";
import { setModal } from "redux/slices/modalSlice";
import Loader from "common/Loader";
import SwitchPage from "common/SwitchPage";
import constrants from "assets/constrants";
import translate from "assets/translation";
import { sortDiscount } from "helpers";
// import Categories from "./Categories";
import ProductCard from "./ProductCard";

const { itemsToDisplay } = constrants;

function Stock() {
  const [productsList, setProductsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setisLoadingCategories] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState(null);
  const container = useRef(null);
  const inputRef = useRef(null);
  const lang = useSelector((state) => state.application.lang);
  const updateProductWrapper = useSelector(
    (state) => state.state.toggleUpdateProducts
  );
  const dispatch = useDispatch();

  const addToCart = (product) => {
    dispatch(addProduct({ product, weight: 1 }));
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  const getProducts = async (useProduct, useFilter, useTotal) => {
    try {
      const result = await products.getProducts(
        useProduct,
        useFilter ?? filter,
        useTotal
      );

      if (result?.status !== 200) {
        dispatch(
          setModal({
            text:
              result?.data ||
              `Error while trying to fetch product${useTotal ? "s" : ""}`
          })
        );
        return;
      }

      if (useTotal) {
        setTotal(result.data.total);
      }

      if (isLoadingProducts) {
        setIsLoadingProducts(false);
      }

      setProductsList(
        result.data.products.map((cur) => ({
          ...cur,
          discount: sortDiscount(cur.discount)
        }))
      );

    } catch (error) {
      setIsLoadingProducts(false);
    }
  };

  const changePage = (value) => {
    const returnVal = parseInt(page) + value;
    if (!(isLoadingCategories || isLoadingProducts)) {
      getProducts(returnVal, filter, false);
    }

    setPage(returnVal);
  };

  const searchBarcode = async (value) => {
    setFilter(value);
    setPage(0);
    try {
      const result = await products.getProductByFilter( value);

      if (result.status !== 200) throw new Error(result.data);

      setProductsList([result.data.product] );
      addToCart(result.data.product)


    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }

    // getProducts(0, value, true);
  };

  useEffect(() => {
    if (inputRef.current) {
      console.log(inputRef.current);
      inputRef.current.focus();
    }

    const controller = new AbortController();

    getProducts(page, filter, true);

    categories.getCategories(controller.signal).then((response) => {
      setisLoadingCategories(false);

      if (response?.status !== 200) {
        dispatch(
          setModal({
            text: response.data ?? "Error while trying to fetch categories"
          })
        );
        return;
      }

      dispatch(editState({ type: "categories", categories: response.data }));
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!(isLoadingCategories || isLoadingProducts)) {
      getProducts(page, filter, false);
    }
  }, [updateProductWrapper]);

  return (
    <div className="col-md-8">
      <div ref={container} className="card-box products-wrapper">
        {isLoadingProducts || isLoadingCategories ? (
          <Loader withoutClose />
        ) : (
          <>

            <div className="modal-body-header">
              <input ref = {inputRef}
                     type = "text"
                     onChange={(e) => { searchBarcode(e.target.value); }} placeholder={translate[lang]['Search by barcode']} className="form-control mb-2" />
            </div>
            <div className="product-container">

              {productsList.length ? (

                productsList.slice(0, itemsToDisplay).map((product, idx) => (
                  <button
                    onKeyDown={(e) => e.preventDefault()}
                    onClick={() => addToCart(product)}
                    type="button"
                    key={`${product._id}-wrapper=${idx}`}
                  >
                    <ProductCard product={product} />
                  </button>
                ))
              ) : (
                <h1>{translate[lang]["Sorry we don't have items"]}</h1>
              )}
              <SwitchPage
                changePage={changePage}
                total={total}
                page={page}
                itemsToDisplay={itemsToDisplay}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Stock;
