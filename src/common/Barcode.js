import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import JsBarcode from 'jsbarcode';

function Barcode({ code }) {
  const svg = useRef(null);

  useEffect(() => {
    JsBarcode(svg.current, code);
  }, []);

  return <svg ref={svg} />;
}

Barcode.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Barcode;
