/* eslint-disable global-require */
/* eslint-disable func-names */
let terminal = null;
const fs = require('fs');
const { exec } = require('child_process');

function sendTransaction(sum) {
  return new Promise((resolve, reject) => {
    if (!terminal) {
      reject(new Error('Lost connection with terminal'));
      return;
    }

    exec(`@echo off & C:\\Arcus2\\CommandLineTool\\bin\\CommandLineTool /o1 /a${(sum * 100).toFixed()} /c643`, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(new Error('Can\'t perform the operation'));
        return;
      }

      setTimeout(() => {
        fs.readFile('C:\\Arcus2\\cheq.out', (err, data) => {
          if (err) {
            reject(new Error('Failed to complete the operation'));
            return;
          }

          const response = data.toString().split('\r').map((cur) => cur.replace(/\t|\n/g, '').trim());
          const find = response.find((cur) => cur.replace(/ /g, '').match(/CODRASPUNS:/));

          if (find) {
            const [numbers] = find.match(/\d+/);
            if (numbers === '000') {
              resolve(response);
              return;
            }
            reject(numbers);
            return;
          }

          reject(new Error('No answer from terminal'));
        });
      }, 250);
    });
  });
}

function changeCom(com) {
  return new Promise((resolve, reject) => {
    fs.readFile('C:\\Arcus2\\INI\\cashreg.ini', (err, data) => {
      const splitted = data.toString().split('\n');
      splitted[1] = `PORT=COM${com}`;
      fs.writeFile('C:\\Arcus2\\INI\\cashreg.ini', splitted.join('\n'), (Err) => {
        if (Err) {
          reject();
          return;
        }
        resolve();
      });
    });
  });
}

function init(result) {
  terminal = result;
}

module.exports = {
  sendTransaction,
  changeCom,
  init,
};
