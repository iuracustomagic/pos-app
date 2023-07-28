/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
const winax = require("winax");
const fs = require("fs");
const logger = require("../logger");
let wtdedit = null;

try {
  wtdedit = new winax.Object("Wtdedit.FpAtl");
} catch {}

module.exports = function () {
  return new Promise((resolve, reject) => {
    fs.readFile(`${process.env.extra}/server/appsettings.json`, (err, data) => {
      const parsed = JSON.parse(data.toString());
      const { model, version, critical, com } = parsed?.connectedDevices?.fiscal
        ? parsed.connectedDevices.fiscal
        : {};

      switch (model) {
        case "datecs":
          switch (true) {
            case version.match(/700/) !== null:
              if (wtdedit === null) {
                reject({
                  error: [`Can't access to the Wtdedit.dll`],
                  critical: critical || false,
                  model,
                });
                return;
              }

              if (wtdedit.sendEx(488839203, 45, "", "")) {
                resolve({ body: wtdedit, model: "datecs" });
                return;
              }

              const result = wtdedit.OpenPortL(911304495, com || 1, 115200);

              setTimeout(() => {
                if (!result) {
                  reject({
                    error: [
                      `Can't connect the fiscal printer, please check the connection Datecs: ${version}`,
                    ],
                    critical: critical || false,
                    model,
                  });
                  return;
                }

                if (
                  !wtdedit.sendEx(488839203, 255, "PrintColumns\t\t42\t", "")
                ) {
                  wtdedit.sendEx(488839203, 69, "Z\t", "");
                  wtdedit.sendEx(488839203, 255, "PrintColumns\t\t42\t", "");
                }

                wtdedit.sendEx(488839203, 255, "LogoPrint\t\t1\t", "");

                const check = () => {
                  if (result) {
                    resolve({ body: wtdedit, model: "datecs" });
                    return;
                  }
                  reject({
                    error: [
                      `Can't connect the fiscal printer, please check the connection Datecs: ${version}`,
                    ],
                    critical: critical || false,
                    model,
                  });
                };

                fs.readdir(`${process.env.extra}/public/images`, (_, dir) => {
                  if (dir.indexOf("logo.bmp") > -1) {
                    const arr = [{ cmd: 202, body: "START\t" }];

                    fs.readFile(
                      `${process.env.extra}/public/images/logo.bmp`,
                      "base64",
                      (__, img) => {
                        let index = 0;
                        img
                          .match(/.{1,72}/gi)
                          .forEach((item) =>
                            arr.push({ cmd: 202, body: `${item}\t` })
                          );
                        arr.push({ cmd: 202, body: "STOPP\t" });
                        arr.push({ cmd: 202, body: "UPDATE\t" });

                        const interval = setInterval(() => {
                          if (
                            !wtdedit.sendEx(
                              488839203,
                              arr[index].cmd,
                              arr[index].body,
                              ""
                            )
                          ) {
                            logger.warn(
                              `Error: ${arr[index].cmd}, ${arr[index].body}`
                            );
                          }

                          index++;

                          if (index >= arr.length) {
                            clearInterval(interval);
                            check();
                          }
                        }, 5);
                      }
                    );

                    return;
                  }
                  check();
                });
              }, 1000);
              break;
            default:
              reject({
                error: [
                  `This model of fiscal printer doesn't exists ${model}: ${version}`,
                ],
                critical: critical || false,
                model,
              });
          }
          break;
        default:
          reject({
            error: [
              `This model of fiscal printer doesn't exists ${model}: ${version}`,
            ],
            critical: critical || false,
            model,
          });
      }
    });
  });
};
