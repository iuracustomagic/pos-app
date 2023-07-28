/* eslint-disable no-mixed-operators */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
let fiscal = true;
let version = '700';
const fs = require('fs');
const logger = require('../logger');

const vat = {
  20: 1,
  8: 2,
  12: 3,
};

function printReciept(info, mode) {
  const { reciept } = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8"));

  return new Promise((resolve, reject) => {
    switch (true) {
      case version.match(/700/) !== null:
        const arr = [{ cmd: 48, body: '1\t1\t1\t' }];

        if (!fiscal) {
          reject(new Error('Lost connection with fiscal printer'));
          return;
        }

        info.forEach((cur) => {
          arr.push({
            cmd: 49,
            body: `${cur.name}\t
              ${vat[cur.nds] || 1}\t
              ${cur.price}\t
              ${cur.weight ? (cur.qty / 1000).toFixed(3) : cur.qty}\t
              ${cur.fullPrice > cur.countedPrice ? 4 : 0}\t
              ${cur.fullPrice > cur.countedPrice ? (cur.fullPrice - cur.countedPrice).toFixed(2) : 0}\t
              0\t
              ${cur.weight ? 'kg' : '.'}\t`,
          });
        });

        logger.info(`Fiscal model: datecs, version: ${version}`);

        mode.forEach((cur) => {
          arr.push({ cmd: 53, body: `${cur.mode}\t${cur.sum.toFixed(2)}\t` });
        });

        if (reciept) {
          reciept.split("\n").forEach((cur) => {
            cur.replace("\s", "")
          })
        }

        const state = [...arr, { cmd: 56, body: '' }].map((cmd) => {
          logger.info(`Fiscal request: ${cmd.cmd},${cmd.body.replace(/\n +/g, '')}`);

          const result = fiscal.sendEx(488839203, cmd.cmd, cmd.body.replace(/\n +/g, ''), '');

          if (!result) {
            logger.error(`Fiscal error on this command: ${cmd.cmd},${cmd.body.replace(/\s+/g, ',')}`);
          }

          return result;
        });

        resolve(state.every((cur) => cur === true));
        break;
      default:
        reject(new Error('This printer doesn\'t exists'));
    }
  });
}

function printFreeText(info) {
  return new Promise((resolve, reject) => {
    switch (true) {
      case version.match(/700/) !== null:
        const arr = [{ cmd: 38, body: '1\t' }];
        if (!fiscal) {
          reject(new Error('Lost connection with fiscal printer'));
          return;
        }

        info.forEach((cur) => {
          arr.push({ cmd: 42, body: `${cur.slice(0, 42)}\t\t\t\t\t1\t\t` });
        });

        const state = [...arr, { cmd: 39, body: '1\t' }].map((cmd) => fiscal.sendEx(488839203, cmd.cmd, cmd.body, ''));
        resolve(state.every((cur) => cur === true));
        break;
      default:
        reject(new Error('This printer doesn\'t exists'));
    }
  });
}

function printReport(type) {
  return new Promise((resolve, reject) => {
    if (!fiscal) {
      reject(new Error('Lost connection with fiscal printer'));
      return;
    }

    switch (true) {
      case version.match(/700/) !== null:
        const status = fiscal.SendEx(488839203, 69, `${type}\t`, '');
        resolve(status);
        break;
      default:
        reject(new Error('This printer doesn\'t exists'));
    }
  });
}

function checkConnection() {
  return new Promise((resolve, reject) => {
    const status = fiscal?.sendEx(488839203, 45, '', '');
    logger.info(`Connection with fiscal: ${status}`);

    if (status === false) {
      reject();
      return;
    }

    resolve();
  });
}

function cashIn(sum) {
  return new Promise((resolve, reject) => {
    const result = fiscal.sendEx(488839203, 70, `0\t${sum}\t`, '');
    if (result) {
      resolve();
      return;
    }
    reject();
  });
}

function cashOut(sum) {
  return new Promise((resolve, reject) => {
    const result = fiscal.sendEx(488839203, 70, `1\t${sum}\t`, '');
    if (result) {
      resolve();
      return;
    }
    reject();
  });
}

function closeReciept() {
  return new Promise((resolve) => {
    fiscal.sendEx(488839203, 60, '', '');

    resolve();
  });
}

function changeCom() {
  return new Promise((resolve) => { resolve(); });
}

function init(result) {
  fiscal = result || null;
  version = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`).toString())?.connectedDevices?.fiscal?.version;
}

module.exports = {
  printReciept,
  printReport,
  printFreeText,
  checkConnection,
  closeReciept,
  cashOut,
  cashIn,
  changeCom,
  init,
};
