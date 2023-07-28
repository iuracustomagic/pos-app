/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-new */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'bootstrap';
import constrants from 'assets/constrants';

function Ad({ display }) {
  const [cart, setCart] = useState([]);
  const [, setIsCarousel] = useState(false);
  const carousel = useRef(null);

  useEffect(() => {
    if (window.api) {
      window.api.receive('transaction', setCart);

      setIsCarousel((oldVal) => {
        if (oldVal === false && display.length) {
          new Carousel(carousel.current, {
            pause: true,
            ride: 'carousel',
            interval: constrants.carouselInterval,
          });

          return true;
        }

        return false;
      });
    }
  }, []);

  return (
    <>
      <div ref={carousel} style={{ opacity: cart.length ? 0 : 1, position: cart.length ? 'absolute' : 'unset' }} className="ad-container carousel slide" data-bs-ride="carousel">
        {
          display.length > 0 ? (
            <div className="carousel-inner">
              {
                display.map((cur, idx) => (
                  <div key={`img-ad-${cur}`} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                    <img className="d-block w-100" src={`ad/${cur}`} alt={`slide ${idx}`} />
                  </div>
                ))
              }
            </div>
          ) : <h3>Sorry, we can't get the advertisment :(</h3>
        }
      </div>
      <div className="ad-container cart">
        <div className="total-price">
          {
            `Total price: ${cart.reduce((prev, cur) => (+(prev + cur.countedPrice).toFixed(2)), 0).toFixed(2)}`
          }
        </div>
        <ul className="list-group">
          {
            cart.map((cur) => (
              <li className="list-group-item">
                <span className="name">{ cur.name }</span>
                <span className="price">{ `${(cur.countedPrice).toFixed(2)} MDL` }</span>
                <span className="qty">{ `${!cur.weight ? `${cur.qty} x` : `${cur.qty / 1000} kg`}` }</span>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  );
}

Ad.propTypes = {
  display: PropTypes.array.isRequired,
};

export default Ad;
