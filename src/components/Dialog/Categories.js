/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setDialog, resetDialog } from 'redux/slices/modalSlice';
import Loader from 'common/Loader';
import { categories as categoriesController } from 'controllers';
import { editState } from 'redux/slices/productSlice';
import { filter as matchingOptions } from 'helpers/index';
import translate from 'assets/translation';

function Categories() {
  const categories = useSelector((state) => state.product.categories);
  const lang = useSelector((state) => state.application.lang);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const dispatch = useDispatch();

  const deleteCategory = async (category) => {
    const result = await categories.deleteCategory(category);

    if (result.status !== 200) {
      dispatch(setModal({ text: result.data || 'Category hasn\'t been deleted' }));
      return;
    }

    dispatch(editState({ type: 'categories', categories: result.data }));
  };

  const editCategory = (category) => {
    dispatch(resetDialog());
    dispatch(setDialog(['NewCategory', category]));
  };

  useEffect(() => {
    if (categories.length) {
      setIsLoading(false);
      return;
    }

    categoriesController.getCategories(localStorage.getItem('jwt'))
      .then((response) => {
        setIsLoading(false);
        dispatch(editState({ type: 'categories', categories: response.data }));
      });
  }, []);

  return (
    <div className="position-relative">
      {
      isLoading ? <Loader /> : (
        <div className="categories">
          <div className="modal-header">
            <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
            <h4 className="modal-title" id="mySmallModalLabel">
              { translate[lang].Categories }
            </h4>
          </div>
          <div className="modal-body">
            <input onChange={(e) => setFilter(e.target.value)} className="form-control search-input" placeholder={translate[lang].Search} />
            <table className="table table-bordered" id="categoryList">
              <thead>
                <tr>
                  <th>{translate[lang].Name}</th>
                  <th>{translate[lang].Action}</th>
                </tr>
              </thead>
              <tbody>
                {
                  categories.map((category, idx) => matchingOptions(category.name, filter) && (
                    <tr key={`${category.name}-categories-modal-${idx}`}>
                      <td className="vertical-middle text-capitalize">{category.name}</td>
                      <td className="vertical-middle">
                        <span className="btn-group">
                          <button onClick={() => editCategory(category.name)} type="button" className="btn btn-warning"><i className="fa fa-edit" /></button>
                          <button onClick={() => deleteCategory(category.name)} type="button" className="btn btn-danger"><i className="fa fa-trash" /></button>
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    </div>
  );
}

export default Categories;
