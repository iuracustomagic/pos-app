/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModal, resetDialog } from 'redux/slices/modalSlice';
import { updateProducts } from 'redux/slices/stateSlice';
import PropTypes from 'prop-types';
import Loader from 'common/Loader';
import Barcode from 'common/Barcode';
import { products, categories as categoriesController } from 'controllers';
import translate from 'assets/translation';

function NewProduct({ product }) {
  const categories = useSelector((state) => state.product.categories);
  const lang = useSelector((state) => state.application.lang);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState(categories);
  const [validated, setValidated] = useState(false);
  const [img, setImg] = useState({});
  const [barcodes, setBarcodes] = useState(product.addition ? product.addition.length : 0);
  const [productInfo, setProductInfo] = useState({
    ...product,
    stock_disable: product.stock_disable || false,
    weight: product.weight || false,
  });

  const getImg = (e) => {
    const imgName = `${Date.now()}.jpg`;

    const renamedFile = new File([e.target.files[0]], imgName, {
      type: e.target.files[0].type,
    });

    setImg(renamedFile);
    setProductInfo((oldVal) => (oldVal.img === 'default.jpg' ? { ...oldVal, img: imgName } : ({ ...oldVal, oldImg: oldVal.img, img: imgName })));
  };

  const create = async () => {
    try {
      if (!productInfo.name || !productInfo.nds || productInfo.addition?.some((cur) => cur.price < 0 || !cur.barcode)) {
        setValidated(true);
        return;
      }

      const result = product._id
        ? await products.updateProduct({ data: productInfo }, img)
        : await products.addProduct({ data: productInfo }, img);

      if (result.status !== 200) throw new Error(result.data);
      dispatch(updateProducts());
      dispatch(resetDialog());
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  const changeBarcode = (value, idx) => {
    setProductInfo((oldVal) => {
      const copy = JSON.parse(JSON.stringify(oldVal));
      copy.addition[idx].barcode = value;
      return copy;
    });
  };

  const changePrice = (value, idx) => {
    setProductInfo((oldVal) => {
      const copy = JSON.parse(JSON.stringify(oldVal));
      copy.addition[idx].price = +value;
      return copy;
    });
  };

  useEffect(() => {
    if (categories.length) {
      setIsLoading(false);
      return;
    }

    categoriesController.getCategories(localStorage.getItem('jwt'))
      .then((response) => {
        if (response.status !== 200) {
          dispatch(setModal({ text: response.data || 'An error occured while taking the categories' }));
          return;
        }
        setCategoriesList(response.data);
        setIsLoading(false);
      })
      .catch(() => dispatch(setModal({ text: 'An error occured while taking the categories' })));
  }, []);

  return (
    <div className="new-product">
      {
        isLoading ? <Loader /> : (
          <>
            <div className="modal-header">
              <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close" aria-hidden="true">×</button>
              <h4 className="modal-title">
                Product
              </h4>
            </div>
            <div className="modal-body">
              <div className={`form-group ${validated ? 'was-validated' : ''}`}>
                <label>Category</label>
                <select onChange={(e) => setProductInfo((oldVal) => ({ ...oldVal, category: e.target.value }))} value={productInfo.category || ''} className="form-control">
                  <option value="">{ translate[lang]['No category'] }</option>
                  {
                    categoriesList.map((category, idx) => (<option value={category.name} key={`category.name-${idx}`}>{ category.name }</option>))
                  }
                </select>
              </div>
              <div className={`form-group ${validated ? 'was-validated' : ''}`}>
                <label>Product Vatrate</label>
                <input onChange={(e) => setProductInfo((oldVal) => ({ ...oldVal, nds: e.target.value }))} value={productInfo.nds || ''} type="text" placeholder="Enter a product vatrate" className="form-control" required="required" />
              </div>
              <div className={`form-group ${validated ? 'was-validated' : ''}`}>
                <label>Product Name</label>
                <input onChange={(e) => setProductInfo((oldVal) => ({ ...oldVal, name: e.target.value }))} value={productInfo.name || ''} type="text" placeholder="Enter a product name" className="form-control" required="required" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input onChange={(e) => setProductInfo((oldVal) => ({ ...oldVal, stock: e.target.valueAsNumber }))} value={productInfo.stock || ''} disabled={!!productInfo.stock_disable} type="number" placeholder="Available stock" className="form-control" />
              </div>
              <div className="multi">
                {
                  new Array(barcodes).fill('.').map((cur, idx) => (
                    <div key={`barcodes-${idx}`} className={`form-group d-flex ${validated ? 'was-validated' : ''}`}>
                      <div className="barcode">
                        <label>Product Barcode</label>
                        <input
                          onChange={(e) => { changeBarcode(e.target.value, idx); }}
                          value={productInfo.addition[idx].barcode || ''}
                          placeholder="Enter a product barcode"
                          className="form-control"
                          type="text"
                          required
                        />
                      </div>
                      <div className="price">
                        <label>Product Price</label>
                        <input
                          onChange={(e) => { changePrice(e.target.value, idx); }}
                          value={productInfo.addition[idx].price || ''}
                          placeholder="Enter a product price"
                          className="form-control"
                          type="number"
                          required
                        />
                      </div>
                    </div>
                  ))
                }
                <div className="barcode-container">
                  {
                    productInfo?.addition?.map((cur, idx) => (
                      <div key={`barcode-${cur.barcode}-${idx}`} className="barcode-render">
                        <Barcode code={cur.barcode || '0'} />
                      </div>
                    ))
                  }
                </div>
              </div>
              <button onClick={() => { setProductInfo((oldVal) => ({ ...oldVal, addition: [...(oldVal.addition || []), {}] })); setBarcodes((oldVal) => oldVal + 1); }} className="btn btn-info float-right mt-2" type="button">
                {
                  translate[lang]['Add more']
                }
              </button>
              <div className="form-group my-3">
                <label htmlFor="disable_stock">
                  <input onChange={(e) => setProductInfo((oldVal) => { const copy = { ...oldVal }; if (e.target.checked) delete copy.stock; return { ...copy, stock_disable: e.target.checked }; })} checked={!!productInfo.stock_disable} type="checkbox" id="disable_stock" className="form-check-input m-r-10" />
                  Disable stock check
                </label>
              </div>
              <div className="form-group my-3">
                <label htmlFor="weight">
                  <input onChange={(e) => setProductInfo((oldVal) => ({ ...oldVal, weight: e.target.checked }))} checked={!!productInfo.weight} type="checkbox" id="weight" className="form-check-input m-r-10" />
                  Weighed product
                </label>
              </div>
              <div className="img-container form-group my-3">
                <input onChange={getImg} type="file" accept=".png,.jpg,.jpeg" />
                {
                  productInfo.img && productInfo.img !== 'default.jpg' && !img.name ? (
                    <>
                      <img src={`./images/${product?.img}`} alt="img" />
                      <button
                        onClick={() => {
                          setProductInfo((oldVal) => (
                            oldVal.img === 'default.jpg'
                              ? ({ ...oldVal, img: 'default.jpg' })
                              : ({ ...oldVal, img: 'default.jpg', oldImg: oldVal.img })
                          ));
                        }}
                        type="button"
                        className="btn btn-xs btn-warning"
                      >
                        { translate[lang].Remove }
                      </button>
                    </>
                  ) : null
                }
              </div>
              <button onClick={create} type="button" className="btn btn-primary w-100">{ Object.keys(product).length ? translate[lang].Update : translate[lang].Create }</button>
            </div>
          </>
        )
      }
    </div>
  );
}

NewProduct.propTypes = {
  product: PropTypes.object,
};

NewProduct.defaultProps = {
  product: {},
};

export default NewProduct;
