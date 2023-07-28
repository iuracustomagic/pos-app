/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setModal, resetDialog } from 'redux/slices/modalSlice';
import { editState } from 'redux/slices/productSlice';
import PropTypes from 'prop-types';
import { categories as categoriesController } from 'controllers/index';

function NewCategory({ updateCategory }) {
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState(false);
  const categories = useSelector((state) => state.product.categories);
  const dispatch = useDispatch();

  const addNewCategory = async () => {
    try {
      if (category.length) {
        const result = updateCategory
          ? await categoriesController.updateCategory(category, updateCategory)
          : await categoriesController.addNewCategory({ category: category.toLowerCase() });

        if (result.status !== 200) throw new Error(result.data);

        if (updateCategory) {
          dispatch(editState({ type: 'categories', categories: categories.map((cur) => (cur.name === updateCategory ? ({ ...cur, name: category }) : cur)) }));
          dispatch(setModal({ text: 'Category has been changed!', state: true }));
          return;
        }

        dispatch(editState({ type: 'categories', categories: [...categories, { name: category.toLowerCase(), popularity: 0 }] }));
        dispatch(setModal({ text: 'Category has been created!', state: true }));

        setMode(false);
        return;
      }
      setMode(true);
    } catch (error) {
      dispatch(setModal({ text: error.message }));
    }
  };

  return (
    <div className="new-category">
      <div className="modal-header">
        <button onClick={() => { dispatch(resetDialog()); }} type="button" className="close">×</button>
        <h4 className="modal-title">
          Category
        </h4>
      </div>
      <div className="modal-body">
        <div className={`form-container ${mode ? 'was-validated' : 'need-validate'}`}>
          <label>Name</label>
          <input onChange={(e) => setCategory(e.target.value)} value={category} type="text" placeholder="Enter a category name" className="form-control" />
          <div className="invalid-feedback">Please fill the form</div>
        </div>
        <button onClick={addNewCategory} type="submit" className="btn btn-primary btn-block waves-effect waves-light w-100 mt-3">
          Send
        </button>
      </div>
    </div>
  );
}

NewCategory.propTypes = {
  updateCategory: PropTypes.string,
};

NewCategory.defaultProps = {
  updateCategory: undefined,
};

export default NewCategory;
