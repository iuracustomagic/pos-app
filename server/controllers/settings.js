/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
const fs = require('fs');
const { app } = require('electron');
const { exec } = require('child_process');
const logger = require('../logger');

async function setSettings(req, res) {
  if (!req.jwt.data.admin) throw new Error('You don\'t have this permission');

  if (req.body.deleteImgs) {
    req.body.deleteImgs.forEach((cur) => {
      fs.unlinkSync(`${process.env.extra}/public/ad/${cur}`);
    });

    delete req.body.deleteImgs;
  }

  Object.keys(req.body.connectedDevices).forEach((cur) => {
    if (!(req.body.connectedDevices[cur].length || Object.keys(req.body.connectedDevices[cur]).length)) {
      delete req.body.connectedDevices[cur];
    }
  });

  fs.writeFile(`${process.env.extra}/server/appsettings.json`, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send('Some error occured while writing the file');
      logger.info('Some error occured while writing the settings file');
      return;
    }

    if (req.body.connectedDevices) {
      Object.keys((req.body.connectedDevices)).forEach((cur) => {
        if (req.body.connectedDevices[cur] instanceof Array) {
          req.body.connectedDevices[cur].forEach((__cur, idx) => {
            if (req.body.connectedDevices[cur][idx].com) {
              require(`../${cur}/index`)[req.body.connectedDevices[cur][idx].model].changeCom(req.body.connectedDevices[cur][idx].com);
            }
          });
          return;
        }

        if (req.body.connectedDevices[cur].com) {
          require(`../${cur}/index`)[req.body.connectedDevices[cur].model].changeCom(req.body.connectedDevices[cur].com);
        }
      });
    }

    logger.info(`Settings has been changed to ${JSON.stringify(req.body)}`);
    res.send(true);
  });
}

async function getSettings(req, res) {
  res.send(JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`).toString()));
}

function killProcess() {
  logger.warn('Kill process!');

  exec('taskkill -F -IM mongod.exe');

  app.exit(0);
}

module.exports = {
  setSettings,
  getSettings,
  killProcess,
};
