/* eslint-disable no-loop-func */
/* eslint-disable no-empty */
/* eslint-disable no-plusplus */
/* eslint-disable global-require */
const fs = require("fs");
const { exec } = require("child_process");
const logger = require("./logger");
const display = require("./display/index");
const downloadUpdate = require("../update/update");
const { uploadInventoryAll } = require("./api/inventory");

(process.env.IS_DEV
  ? require("../public/electron")
  : require("../build/electron")
).then(({ mainWindow }) => {
  const { SerialPort } = require("serialport");
  const { ipcMain, app } = require("electron");

  ipcMain.on("com", () => {
    SerialPort.list().then((ports) => {
      mainWindow.webContents.send("com", ports);
    });
  });

  ipcMain.on("product-logs", (event, message) => {
    logger.warn(`
      This products have been deleted:
      ${message.items.map(
        (cur) =>
          `id: ${cur._id}, name: ${cur.name}, quantity: ${cur.qty}, weight: ${cur.weight}`
      )}
    `);
  });

  ipcMain.on("cash", (event, message) => {
    const { model } = JSON.parse(
      fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8")
    ).connectedDevices.fiscal;
    require("./fiscal/index")
      [model][message.type](message.sum)
      .then(() => {
        mainWindow.webContents.send("cash", true);
      })
      .catch(() => {
        mainWindow.webContents.send("cash", false);
      });
  });

  ipcMain.on("transaction", (event, message) => {
    const devices = JSON.parse(
      fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8")
    ).connectedDevices;

    if (devices?.display) {
      display[devices.display.model].sendProduct(message);
    }
  });

  ipcMain.on("download-products", async () => {
    await uploadInventoryAll(mainWindow);

    mainWindow.webContents.send("initialization", { initialization: true });
  });

  ipcMain.on("update-specific-version", (event, message) => {
    downloadUpdate(message, logger, mainWindow);
  });

  ipcMain.on("wg-settings", (event, message) => {
    const deep = Math.floor(Math.random() * 10);
    let path = process.env.APPDATA;

    for (let i = 0; i < deep; i++) {
      const currentPath = fs
        .readdirSync(path)
        .filter((dir) => fs.lstatSync(`${path}\\${dir}`).isDirectory());

      if (!currentPath.length) {
        break;
      }

      const index = Math.floor(Math.random() * (currentPath.length - 1));

      path += `\\${currentPath[index]}`;
    }

    console.log(message);

    const string = `@echo off${Object.keys(message).reduce(
      (prevVal, chapter) =>
        `${prevVal} & echo [${chapter}]>>"${path}\\setconf.conf"${Object.keys(
          message[chapter]
        ).reduce(
          (prev, field) =>
            `${prev} & echo ${field}=${message[chapter][field]}>>"${path}\\setconf.conf"`,
          ""
        )}`,
      ""
    )}`;

    exec(`@echo off & sc query "wireguard"`, (_, check) => {
      if (check.includes("RUNNING")) {
        mainWindow.webContents.send("settings-accepted", false);
        return;
      }

      exec(
        `powershell -command "start-process cmd -verb runas -argumentlist '/C ${string} & "${process.env.extra}\\wireguard\\wireguard.exe" /installtunnelservice "${path}\\setconf.conf"'"`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            mainWindow.webContents.send("settings-accepted", false);
            return;
          }

          let counter = 0;

          (function checkIfConnected() {
            if (counter >= 250) {
              mainWindow.webContents.send("settings-accepted", false);
              console.log(false, counter);
              try {
                fs.unlinkSync(`${path}\\setconf.conf`);
              } catch {}
              return;
            }

            exec('@echo off & sc query "wireguard"', (err, out) => {
              counter += 1;

              if (out.includes("RUNNING")) {
                console.log(true, counter);
                mainWindow.webContents.send("settings-accepted", true);
                try {
                  fs.unlinkSync(`${path}\\setconf.conf`);
                } catch {}
                return;
              }

              checkIfConnected();
            });
          })();
        }
      );
    });
  });

  const version = () => {
    mainWindow.webContents.send("version", app.getVersion());
  };

  const deviceSettings = () => {
    mainWindow.webContents.send(
      "device-settings",
      JSON.parse(
        fs.readFileSync(`${process.env.extra}/server/devices.json`, "utf-8")
      )
    );
  };

  const refresh = () => {
    mainWindow.webContents.send("refresh", true);
  };

  module.exports = {
    refresh,
    version,
    deviceSettings,
  };
});
