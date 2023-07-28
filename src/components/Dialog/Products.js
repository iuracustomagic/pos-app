/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setDialog, resetDialog } from 'redux/slices/modalSlice';
import { updateProducts } from 'redux/slices/stateSlice';
import SwitchPage from 'common/SwitchPage';
import Loader from 'common/Loader';
import { products } from 'controllers';
import constrants from 'assets/constrants';
import translate from 'assets/translation';
const { itemsToDisplay } = constrants;

function Products() {
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [page, setPage] = useState(0);
  const lang = useSelector((state) => state.application.lang);
  const { currency } = useSelector((state) => state.application.applicationSettings);
  const dispatch = useDispatch();

  const getProducts = async (useProduct, useFilter, useTotal) => {
    try {
      const result = await products.getProducts(useProduct, useFilter, useTotal, true);
      if (result.status !== 200) throw new Error(result.data);
      setProductsList(result.data.products);

      if (useTotal) {
        setTotal(result.data.total);
      }

      if (isLoading) {
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  const searchBarcode = async (value) => {
    setFilter(value);
    setPage(0);
    try {
      const result = await products.getProductByFilter( value);
      console.log([result.data.product])
      if (result.status !== 200) throw new Error(result.data);
      setProductsList( [result.data.product]   );

         if (isLoading) {
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }

    // getProducts(0, value, true);
  };

  const changePage = (value) => {
    const countedVal = parseInt(page) + value;
    getProducts(countedVal, filter, false);
    setPage(countedVal);
  };

  const editProduct = (product) => {
    dispatch(setDialog(['NewProduct', product]));
  };

  const deleteProduct = async (id, idx, img) => {
    try {
      const result = await products.deleteProductById(id, img);
      if (result.status !== 200) throw new Error(result.data);
      const productClone = [...productsList];
      productClone.splice(idx, 1);
      setProductsList(productClone);
      dispatch(updateProducts());
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  useEffect(() => {
    getProducts(page, filter, true);
    console.log(' productsList' ,productsList)
  }, []);

  return (
    <div className="products">
      {
        isLoading ? <Loader /> : (
          <>
            <div className="modal-header">
              <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title">
                { translate[lang].Products }
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body-header">
                <input onChange={(e) => { searchBarcode(e.target.value); }} placeholder={translate[lang]['Search by barcode']} className="form-control mb-2" />
              </div>
              <table className="table table-bordered products-dialog-table">
                <thead>
                  <tr>
                    <th>{ translate[lang].Barcode }</th>
                    <th>{ translate[lang].Price }</th>
                    <th>{ translate[lang].Item }</th>
                    <th>{ translate[lang].Name }</th>
                    <th>{ translate[lang].Stock }</th>
                    <th>{ translate[lang].Category }</th>
                    <th>{ translate[lang].Action }</th>
                  </tr>
                </thead>
                <tbody>
                  {
                   productsList.slice(0, itemsToDisplay).map((product, idx) => (
                      <tr key={`${product._id}-products`}>
                        <td className="barcode">
                          {
                            product.addition ? product.addition.map((cur) => (
                              <span key={`${product._id}-products-${cur.barcode}`}>{ cur.barcode }</span>
                            )) :  <span key={`${product._id}-products-${product.barcode}`}>{ product.barcode }</span>
                          }
                        </td>
                        <td className="price">
                          {
                            product.addition ? product.addition.map((cur) => (
                              <span key={`products-price-${cur._id}`}>
                                { currency || 'Currency is not set!' }
                                <span className="font-weight-400">{` ${cur.price}`}</span>
                              </span>
                            )) : <span key={`products-price-${product._id}`}>
                                { currency || 'Currency is not set!' }
                              <span className="font-weight-400">{` ${product.price}`}</span>
                              </span>
                          }
                        </td>
                        <td className="image">
                          <img src={`./images/${product.img}`} alt="product" />
                        </td>
                        <td>
                          { product.name }
                        </td>
                        <td>
                          { product.stock_disable ? 'Stock N/A' : `Stock ${product.stock}`}
                        </td>
                        <td>
                          { product.category }
                        </td>
                        <td>
                          <span className="btn-group">
                            <button onClick={() => editProduct(product)} type="button" className="btn btn-warning btn-sm"><i className="fa fa-edit" /></button>
                            <button onClick={() => deleteProduct(product._id, idx, product.img)} type="button" className="btn btn-danger btn-sm"><i className="fa fa-trash" /></button>
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <SwitchPage changePage={changePage} page={page} total={total} itemsToDisplay={itemsToDisplay} />
            </div>
          </>
        )
      }
    </div>
  );
}

export default Products;
