/* eslint-disable no-empty */
/* eslint-disable global-require */
/* eslint-disable indent */
const fs = require('fs');
const logger = require('../logger');
const { product, transaction } = require('../schema/index');
const terminal = require('../terminal/index');
const fisc = require('../fiscal/index');
const disp = require('../display/index');
const { refresh } = process?.env?.SERVER ? {} : require('../ipc');
const { uploadChecks, uploadReturned } = require('../api/checks');

async function newPayment(req, res) {
  const settings = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`)).connectedDevices;
  const { fiscal, display, z } = settings;

  try {
    if (!req.body.data.items.length) {
      throw new Error('Please add products in the cart!');
    }

    const successfullTransaction = async () => {
      const trans = await transaction.create(req.body.data);
      res.send('Transaction completed successfully');

      if (!process.env.IS_DEV) {
        await uploadChecks({
          checks: [{
            ...req.body.data,
            items: req.body.data.items.map((cur) => ({
              _id: cur._id,
              countedPrice: cur.countedPrice,
              fullPrice: cur.fullPrice,
              qty: cur.qty,
              price: cur.price,
            })),
            _id: trans._id,
            date: trans.date,
            shop: '001',
            cass: '001',
          }],
        });
      }

      const categories = JSON.parse(fs.readFileSync(`${process.env.extra}/server/categories.json`, 'utf-8'));

      if (display) {
        disp[display.model].endTransaction();
      }

      if (z === true) {
        try {
          fs.writeFileSync(`${process.env.extra}/server/appsettings.json`, JSON.stringify({ ...settings, z: new Date() }, null, 2));
        } catch { }
      }

      req.body.data.items.forEach(async (cur) => {
        if (cur.qty) {
          const index = categories.findIndex((category) => category.name === cur.category);
          await product.updateOne(
            { _id: cur._id, 'addition.barcode': cur.barcode },
            { $inc: { 'addition.$.popularity': cur.qty } },
          );

          if (index >= 0) {
            categories[index].popularity += cur.weight ? 1 : cur.qty;
          }
        }

        fs.writeFile(`${process.env.extra}/server/categories.json`, JSON.stringify(categories), (err) => {
          if (err) {
            logger.warn('Couldn\'t update a categories popularity');
          }
        });
      });
    };

    if (process.env.IS_DEV) {
      if (req.body.data.mode.some((cur) => cur.mode === 1)) {
        terminal[req.body.data.terminal]
        .sendTransaction(req.body.data.mode.find((cur) => cur.mode === 1).sum)
        .then(successfullTransaction)
        .catch((info) => {
          res.status(500).send(`Terminal Error: ${info.message || info || ''}`);
        });
        return;
      }
      successfullTransaction();
      return;
    }

    if (req.body.data.mode.some((cur) => cur.mode === 1)) {
      fisc[fiscal.model]
      .checkConnection()
      .then(() => {
        terminal[req.body.data.terminal]
        .sendTransaction(req.body.data.mode.find((cur) => cur.mode === 1).sum)
        .then(async (info) => {
          const reciept = await fisc[fiscal.model].printReciept(req.body.data.items, req.body.data.mode);
          const costumerReciept = await fisc[fiscal.model].printFreeText(info);
          const cashierReciept = await fisc[fiscal.model].printFreeText(info);

          if ((costumerReciept && cashierReciept && reciept) || process?.env?.IS_DEV) {
            successfullTransaction();
            return;
          }

          res.status(500).send(!reciept ? 'Error with fiscal printer' : 'Error with printing the bank reciept');
        })
        .catch((info) => {
          res.status(500).send(`Terminal Error: ${info}`);
        });
      })
      .catch(() => {
        res.status(500).send('Lost connection with the fiscal printer');

        if (refresh) {
          refresh();
        }
      });
      return;
    }

    fisc[fiscal.model]
    .checkConnection()
    .then(async () => {
      const result = await fisc[fiscal.model].printReciept(req.body.data.items, req.body.data.mode);

      if (result || process?.env?.SERVER) {
        successfullTransaction();
        return;
      }

      fisc[fiscal.model]
      .closeReciept()
      .then(() => {
        res.status(500).send('Some error occured with fiscal printer');
      });
    })
    .catch((error) => {
      if (display) {
        disp[display.model].endTransaction();
      }

      res.status(500).send(error.message || 'The fiscal printer is not connected');
      refresh();
    });
  } catch (error) {
    logger.info(error.message);

    if (display) {
      disp[display.model].endTransaction();
    }

    res.status(500).send(error.message || 'An error occured while adding a new transaction');
  }
}

async function getTransactions(req, res) {
  try {
    const query = req.query.check.length ? {
      date: {
        $lt: new Date(new Date(req.query.check).getTime() + 60 * 1000),
        $gte: new Date(new Date(req.query.check).getTime() - 60 * 1000),
      },
    } : {};

    const result = await transaction.find(query).skip(+req.query.page).limit(1);

    res.send({ total: await transaction.find(query).count(), transaction: result });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function returnProduct(req, res) {
  try {
    const { fiscal } = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`)).connectedDevices;

    fisc[fiscal.model].checkConnection()
    .then(() => {
      const sum = req.body.items.reduce((prev, cur) => (cur.returned ? +(cur.countedSum + prev).toFixed(2) : prev), 0);

      fisc.cashOut(sum)
      .then(async () => {
        await transaction.deleteOne({ _id: req.body._id });

        res.send(true);

        uploadReturned({ checks: [{ _id: req.body._id, return: req.body.items }] });
      });
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  newPayment,
  getTransactions,
  returnProduct,
};
