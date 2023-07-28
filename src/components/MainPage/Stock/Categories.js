/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import translate from 'assets/translation';

function Categories({ setFilter, setPage, getProducts, filter }) {
  const lang = useSelector((state) => state.application.lang);
  const categories = useSelector((state) => state.product.categories);

  const applyFilter = useCallback((useFilter) => {
    setPage(0);
    getProducts(0, useFilter, true);
    setFilter(useFilter);
  }, []);

  return (
    <div className="row col-md-8 filter">
      <div className="col-md-4">
        <input onChange={(e) => { applyFilter({ ...filter, 'addition.barcode': { $regex: `^${e.target.value}` } }); }} type="number" className="form-control" placeholder={translate[lang]['Search by barcode']} />
      </div>
      <div className="col-md-8">
        <div className="categories-options">
          {
            categories.length ? <button onClick={() => applyFilter({})} type="button" className="btn btn-light font-13">{ translate[lang].All }</button> : null
          }
          {
            categories.slice(0, 4).map((category) => (
              <button
                onClick={() => applyFilter({ ...filter, category: category.name })}
                key={`${category.name}-wrapper`}
                type="button"
                className="btn btn-light font-13"
              >
                {category.name.split(' ').map((cur) => (cur.length > 2 ? `${cur[0].toUpperCase()}${cur.slice(1).toLowerCase()}` : cur.toLowerCase())).join(' ')}
              </button>
            ))
         }
          <div className="more-container">
            <button className="btn btn btn-light font-13 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              { translate[lang].More }
            </button>
            <ul className="dropdown-menu">
              {
                categories.slice(4).map((category, idx) => (
                  <li key={`${category.name}-wrapper-${idx}`}>
                    <button
                      onClick={() => applyFilter({ ...filter, category: category.name })}
                      key={`${category.name}-wrapper`}
                      type="button"
                      className="btn btn-light font-13"
                    >
                      {category.name.split(' ').map((cur) => (cur.length > 2 ? `${cur[0].toUpperCase()}${cur.slice(1).toLowerCase()}` : cur.toLowerCase())).join(' ')}
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Categories.propTypes = {
  setFilter: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
};

export default Categories;
