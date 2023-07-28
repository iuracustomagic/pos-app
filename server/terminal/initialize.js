/* eslint-disable func-names */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
const net = require('net');
const { exec } = require('child_process');
const fs = require('fs');
const logger = require('../logger');
const server = net.createServer();
let connection = null;
let timeout = null;

module.exports = (function (model, version) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${process.env.extra}/server/appsettings.json`, (err, data) => {
      const { terminal } = JSON.parse(data.toString()).connectedDevices;
      const index = terminal.find((cur) => cur.model === model);

      switch (model) {
        case 'verifone':
          switch (true) {
            case ['5', '6', '8'].includes(version[2]):
              if (!process?.env?.LOCAL_ADDRESS) {
                reject({ error: [`No internet connection Verifone: ${version}`], model, critical: index?.critical });
                return;
              }

              if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
              }

              timeout = setTimeout(() => {
                reject({ error: [`Timeout expired, can't connect the terminal Verifone: ${version}`], model, critical: index?.critical });
                timeout = null;
              }, 10000);

              server.on('connection', (conn) => {
                try {
                  resolve({ model, body: conn });
                  clearTimeout(timeout);
                  timeout = null;
                  connection = conn;
                } catch (error) {
                  logger.warn(`Verifone unnecessary connection error: ${error.message}`);
                }
              });

              server.on('error', (Err) => {
                logger.error(`Verifone connection error: ${Err}`);

                if (Err.code === 'EADDRINUSE') {
                  server.close();
                }
              });

              try {
                server.listen(9990, process.env.LOCAL_ADDRESS);
              } catch (error) {
                if (connection) {
                  connection.destroy();
                }
              }
              break;
            default:
              reject({ error: [`This terminal is out of service ${model}: ${version}`], model, critical: index?.critical });
          }
          break;
        case 'ingenico':
          exec('@echo off & C:\\Arcus2\\CommandLineTool\\bin\\CommandLineTool /o201', (error, stdout, stderr) => {
            if (error || stderr) {
              reject({ error: [`We can't connect ingenico terminal ${version}`], model, critical: index?.critical });
              return;
            }

            setTimeout(() => {
              fs.readFile('C:\\Arcus2\\output.dat', (Err, Data) => {
                if (Err) {
                  reject({ error: ['Can\'t acces root: C:\\Arcus2\\output.dat'], model, critical: index?.critical });
                  return;
                }

                if (Data.toString().split('\n')[0].trim() === '000') {
                  resolve({ model, body: true });
                  return;
                }

                reject({ error: [`Terminal Ingenico: ${version} is not connected!`], model, critical: index?.critical });
              });
            }, 250);
          });
          break;
        default:
          reject({ error: [`This terminal is out of service ${model}: ${version}`], model, critical: index?.critical });
      }
    });
  });
});
