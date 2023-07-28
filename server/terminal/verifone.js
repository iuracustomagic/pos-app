/* eslint-disable global-require */
let terminal = null;
let version = null;
const fs = require('fs');
const logger = require('../logger');

function cancel() {
  return new Promise((resolve) => {
    try {
      const timeout = setTimeout(resolve, 5000);
      terminal.write('000114', 'hex');

      terminal.once('data', (ack) => {
        if (ack[1] === 1 && ack[2] === 6) {
          logger.warn('ACK isn\'t correct while trying to force cancelation');
        }

        terminal.once('data', (number) => {
          const parsed = parseFloat(number.toString().match(/00=\d+/)[0].split('=')[1]);
          terminal.write('000106', 'hex', () => {
            terminal.write(`${String.fromCharCode(0)}'00=${parsed}03=r62=2.0.163=IIW 2016'`);

            terminal.once('data', () => {
              terminal.write('000104', 'hex', () => {
                clearTimeout(timeout);
                resolve();
              });
            });
          });
        });
      });
    } catch (error) {
      resolve();
    }
  });
}

function sendTransaction(sum) {
  return new Promise((resolve, reject) => {
    if (!terminal) {
      reject(new Error('Lost connection with terminal'));
      return;
    }

    switch (true) {
      case ['5', '6', '8'].includes(version[2]):
        try {
          terminal.write('000114', 'hex');

          terminal.once('data', (ack) => {
            logger.info(`Verifone ACK ${ack[1]}${ack[2]}`);

            if (ack[1] === 1 && ack[2] === 6) {
              terminal.once('data', (number) => {
                const parsed = parseFloat(number.toString().match(/00=\d+/)[0].split('=')[1]);
                terminal.write('000106', 'hex', () => {
                  terminal.write(`${String.fromCharCode(0)}'00=${parsed}03=S05=${(sum * 100).toFixed()}62=2.0.163=IIW 2016'`, 'ascii');

                  terminal.once('data', (_ack) => {
                    logger.info(`Second ACK: ${_ack}`);

                    if (_ack[1] === 1 && _ack[2] === 6) {
                      terminal.once('data', (payment) => {
                        if (payment[0] === 0 && payment[1] === 1 && payment[2] === 4) {
                          cancel().then(() => reject(new Error('Operation has been canceled')));
                          return;
                        }

                        terminal.once('data', (info) => {
                          let result = null;
                          const response = info.toString().split('\r');
                          if (response.length) {
                            const find = response.map((cur) => {
                              const temp = cur.replace(/\t|\n|,/g, '').trim();
                              if (temp.replace(/ /g, '').match(/CODRASPUNS/)) {
                                result = temp;
                              }
                              return temp;
                            });

                            if (result) {
                              const [numbers] = result.match(/\d+/);
                              if (numbers.match(/00|Y1|Y2|Y3/)) {
                                logger.info(`Verifone correct answer: ${find?.join('\n') || find}`);
                                resolve(find);
                                return;
                              }
                              logger.warn(`Terminal answer wrong: ${numbers}`);
                              reject(numbers);
                              return;
                            }

                            logger.error(`Verifone text wrong: ${find?.join('\n') || find}`);
                          }

                          cancel().then(() => reject(new Error('Incorrect asnwer from terminal')));
                        });
                      });
                      return;
                    }
                    cancel().then(() => reject(new Error('The terminal cannot perform the operation')));
                  });
                });
              });
              return;
            }
            cancel().then(() => reject(new Error('The terminal cannot perform the operation')));
          });
        } catch (error) {
          reject(error);
        }
        break;
      default:
        reject(new Error('This terminal is out of service'));
    }
  });
}

function init(result) {
  terminal = result || null;
  version = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`).toString()).connectedDevices.terminal.find((cur) => cur.model === 'verifone')?.version;
}

module.exports = {
  sendTransaction,
  init,
};
