/* eslint-disable radix */
import React from 'react';
import PropTypes from 'prop-types';

function SwitchPage({ changePage, page, total, itemsToDisplay }) {
  return (
    <div className="switch-product-list">
      <button onClick={() => changePage(-itemsToDisplay)} disabled={page - itemsToDisplay < 0} className="btn btn-light" type="button">{ '<' }</button>
      <div className="list">{ `${parseInt(parseInt(page) / itemsToDisplay + 1)} / ${((total / itemsToDisplay) < 1 ? 1 : ((total / itemsToDisplay) + 1).toFixed()) || 1}` }</div>
      <button onClick={() => changePage(itemsToDisplay)} disabled={total <= page + itemsToDisplay} className="btn btn-light" type="button">{ '>' }</button>
    </div>
  );
}

SwitchPage.propTypes = {
  changePage: PropTypes.func.isRequired,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  total: PropTypes.number,
  itemsToDisplay: PropTypes.number.isRequired,
};

SwitchPage.defaultProps = {
  total: 1,
};

export default SwitchPage;
