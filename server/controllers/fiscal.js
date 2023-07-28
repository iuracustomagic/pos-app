/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const logger = require('../logger');

function execReport(req, res) {
  try {
    const { model } = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`).toString()).connectedDevices.fiscal;
    require('../fiscal/index')[model]
      .printReport(req.query.type)
      .then(() => {
        if (req.query.type === 'Z') {
          const settings = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`, 'utf-8'));
          fs.writeFileSync(`${process.env.extra}/server/appsettings.json`, JSON.stringify({ ...settings, z: true }, null, 2));
        }

        res.send(true);
      }).catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message || false);
  }
}

module.exports = {
  execReport,
};
