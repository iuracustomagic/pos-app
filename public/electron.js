/* eslint-disable global-require */
let mainWindow = null;
const fs = require("fs");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { exec } = require("child_process");
const { SERVER_PORT } = require("../server/env.json");
const { killProcess } = require("../server/controllers/settings");
const { getTags, checkForUpdates } = require("../server/helpers");
const downloadUpdate = require("../update/update");
const logger = require("../server/logger");
const {
  checkConnection,
  checkIfLaunched,
  initializeDevices
} = require("../server/initialize");

module.exports = new Promise((resolve) => {
  app.on("ready", () => {
    checkIfLaunched
      .then(async () => {
        mainWindow = new BrowserWindow({
          width: 800,
          height: 600,
          show: false,
          resizable: false,
          closable: false,
          fullscreen: true,
          frame: false,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: true // process.env.IS_DEV
          }
        });

        mainWindow.show();

        mainWindow.on("closed", () => {
          logger.warn("App is closing");

          mainWindow = null;
          exec("taskkill -F -IM mongod.exe", () => {
            killProcess();
          });
        });

        if (!process.env.IS_DEV) {
          mainWindow.on("resize", () => {
            mainWindow.maximize();
          });

          mainWindow.on("focus", () => {
            mainWindow.show();
          });
        }

        ipcMain.on("window-rendered", async () => {
          require("../server/ipc");

          const versions = await getTags(logger);

          if (versions !== false) {
            const update = checkForUpdates(versions, logger);

            if (update !== false && !process.env.IS_DEV) {
              downloadUpdate(update, logger, mainWindow);
              return;
            }
          }

          checkConnection
            .then(() => {
              resolve({ mainWindow, ipcMain });
              initializeDevices({ mainWindow });

              mainWindow.webContents.send("update-versions", versions);
            })
            .catch((error) => {
              logger.error("Check connection error");
              dialog.showErrorBox(
                "Application error",
                error?.message ?? error ?? "Unknown error"
              );
              killProcess();
            });
        });

        require("../server/index")
          .then(() => {
            mainWindow.maximize();
            mainWindow.loadURL(`http://localhost:${SERVER_PORT || 5500}`);
            mainWindow.show();
          })
          .catch((error) => {
            logger.error("Server error");
            dialog.showErrorBox(
              "Application error",
              error?.message || "Unknown error"
            );
            killProcess();
          });
      })
      .catch((err) => {
        logger.error(`Electron launch error: ${err.message}`);
        killProcess();
      });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("quit", () => {
    const appsettings = JSON.parse(
      fs.readFileSync(`${process.env.extra}/server/appsettings.json`),
      "utf-8"
    );
    fs.writeFileSync(
      `${process.env.extra}/server/appsettings.json`,
      JSON.stringify(
        { ...appsettings, turned_off: new Date().toISOString().split("T")[0] },
        null,
        2
      )
    );
  });
});
