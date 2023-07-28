/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable func-names */
const electron = require("electron");
const fs = require("fs");
const path = require("path");
const logger = require("../logger");
const { BrowserWindow, ipcMain } = electron;
const { SERVER_PORT } = require("../env.json");
let displayWindow = null;

module.exports = function (closeWindows) {
  return new Promise((resolve, reject) => {
    const { display } = JSON.parse(
      fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8")
    ).connectedDevices;

    if (closeWindows) {
      if (displayWindow !== null) {
        displayWindow.hide();
        displayWindow.close();
        displayWindow = null;
      }
      resolve();
      return;
    }

    if (!display) {
      reject(null);
      return;
    }

    switch (true) {
      case display.model === "posiflex":
        if (displayWindow !== null) {
          displayWindow.hide();
          displayWindow.close();
          displayWindow = null;
        }

        const displays = electron.screen.getAllDisplays();
        const externalDisplay = displays.find(
          (item) => item.bounds.x !== 0 || item.bounds.y !== 0
        );

        if (externalDisplay || process.env.IS_DEV) {
          displayWindow = new BrowserWindow({
            x: (externalDisplay?.bounds?.x || -50) + 50,
            y: (externalDisplay?.bounds?.y || -50) + 50,
            width: externalDisplay?.bounds?.width || 800,
            height: externalDisplay?.bounds?.height || 600,
            show: false,
            resizable: false,
            closable: false,
            fullscreen: true,
            frame: false,
            autoHideMenuBar: true,
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: true,
              devTools: true,
              preload: path.join(__dirname, "preload.js")
            }
          });

          displayWindow.once("closed", () => {
            displayWindow = null;
            logger.warn("Posiflex window has been closed");
          });

          ipcMain.on("ad-window-rendered", () => {
            fs.readdir(`${process.env.extra}/public/ad`, (err, data) => {
              displayWindow.webContents.send("display-ad-images", data);
            });
          });

          displayWindow.maximize();
          displayWindow.loadURL(`http://localhost:${SERVER_PORT || 5500}`);
          displayWindow.show();

          resolve({ body: displayWindow, model: "posiflex" });
          return;
        }

        reject({
          error: ["There are no external displays"],
          critical: display?.critical,
          model: display.model
        });
        return;
      default:
        reject({
          error: [
            `This display is out of service ${display.model}: ${display.version}`
          ],
          model: display.model,
          critical: display?.critical
        });
    }
  });
};
