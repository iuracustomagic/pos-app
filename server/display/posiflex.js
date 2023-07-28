let display = null;
const logger = require('../logger');

function sendProduct(product) {
  try {
    if (!display) {
      throw new Error('Display posiflex isn\'t initialized');
    }

    display.webContents.send('transaction', product);
  } catch (error) {
    logger.warn(`Display posiflex, error to display product: ${error.message}`);
  }
}

function endTransaction() {
  try {
    if (!display) {
      throw new Error('Display posiflex isn\'t initialized');
    }
  } catch (error) {
    logger.warn(`Display posiflex, error while ending transaction: ${error.message}`);
  }
}

function init(param) {
  display = param;
}

module.exports = {
  sendProduct,
  endTransaction,
  init,
};
