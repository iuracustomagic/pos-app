/* eslint-disable camelcase */
/* eslint-disable no-extend-native */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-shadow */
const mongoose = require("mongoose");
const { networkInterfaces } = require("os");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const find = require("find-process");
const logger = require("./logger");

process.env.dirname = __dirname;
process.env.extra = process.env.IS_DEV
  ? path.resolve(__dirname, "../")
  : path.resolve(__dirname, "../../");
const app = JSON.parse(
  fs.readFileSync(`${process.env.extra}/server/appsettings.json`).toString()
);
const { DATABASE_USERNAME, DATABASE_PASSWORD, DB_PORT } = require("./env.json");
const nets = networkInterfaces();
const { launched } = app;

Object.keys(nets).some((cur) => {
  if (nets[cur] instanceof Array) {
    process.env.LOCAL_ADDRESS = nets[cur].find(
      (val) => val?.family === "IPv4" && !val?.internal
    )?.address;
    return true;
  }
  return false;
});

const checkIfLaunched = new Promise((resolve) => {
  (function firstLauch() {
    if (!launched) {
      /* If register doesn't works, remove @echo off */
      exec(
        `powershell -command "start-process cmd -verb runas -argumentlist '/C /Q echo off & start "${process.env.extra}/server/register.bat" && exit'"`,
        { windowsHide: true },
        (error, stderr) => {
          if (!error && !stderr) {
            fs.writeFile(
              `${process.env.extra}/server/appsettings.json`,
              JSON.stringify({ ...app, launched: true }, null, 2),
              async () => {
                resolve();
              }
            );

            return;
          }

          firstLauch();
        }
      );

      return;
    }

    resolve();
  })();
});

const connectDatabase = new Promise((resolve, reject) => {
  logger.info(`Launching Database on port ${DB_PORT}`);

  (function installPackage() {
    exec(
      `"${process.env.extra}/mongodb/bin/mongod.exe" --dbpath "${process.env.extra}/data" --auth --port ${DB_PORT}`,
      (error) => {
        if (error?.code === 3221225781) {
          exec(
            `start "${process.env.extra}/mongodb/bin/vc_redist.x64" /Q`,
            (error, stdout, stderr) => {
              if (!error && !stderr) {
                installPackage();
                resolve();
              }
            }
          );
        }
      }
    );
  })();

  (function findDbPort() {
    find("port", DB_PORT).then((info) => {
      logger.info("Connecting Database");

      if (!info.length) {
        setTimeout(findDbPort, 1000);
        return;
      }
      mongoose.set("strictQuery", false);

      mongoose.connect(
        `mongodb://127.0.0.1:${DB_PORT}/restarauntdb?authMechanism=SCRAM-SHA-256`,
        {
          useNewUrlParser: true,
          auth: {
            username: DATABASE_USERNAME,
            password: DATABASE_PASSWORD
          }
        },
        (err) => {
          if (err) {
            reject(err);
            logger.warn("Database hasn't been connected");
            return;
          }

          logger.info("Database has been connected");
          resolve();
        }
      );

      mongoose.pluralize(null);

      mongoose.connection.on("error", () => {
        console.log("Could not connect to mongo server!");
      });
    });
  })();
});

const checkConnection = new Promise((resolve, reject) => {
  connectDatabase
    .then(() => {
      if (!process?.env?.SERVER) {
        logger.info("Launching the server");

        checkIfLaunched.then(() => {
          require("./index").then(resolve);
        });
      }
    })
    .catch((err) => {
      reject(err.message);
      logger.log("Connect Database error");
    });
});

function initializeDevices({ mainWindow }) {
  const { connectedDevices, initialize, api_url } = JSON.parse(
    fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8")
  );

  /*
    Remove process.env.REMOVE after date update would be done
  */

  Promise.all(
    api_url && process.env.REMOVE // && process.env.REMOVE
      ? [
          require("./api/inventory").updateDiscount(mainWindow),
          require("./api/inventory").updateInventory(mainWindow)
        ]
      : []
  ).then((update) => {
    const updateItems = ["inventory", "discount"];

    update.forEach((cur, idx) => {
      if (!cur) {
        mainWindow.webContents.send("initialization", {
          update: { error: `Can't perform ${updateItems[idx]} update` }
        });
      }
    });

    const { version, deviceSettings } = require("./ipc");

    logger.info("Initializing devices");

    if (!process.env.SERVER) {
      version();
      deviceSettings();
    }

    if (!connectedDevices || !Object.keys(connectedDevices)?.length) {
      mainWindow.webContents.send("initialization", { initialization: true });
      return;
    }

    // Close all extra windows
    require("./display/initialize")(true);

    const order = [
      "fiscal",
      "display",
      ...(connectedDevices?.terminal?.map(() => "terminal") || [])
    ].filter((cur) =>
      Object.keys(connectedDevices).some((device) => device === cur)
    );
    const device = [];

    logger.info(`Connected devices: ${JSON.stringify(connectedDevices)}`);
    logger.info(`Initialization setting: ${!!initialize}`);

    const checkDevices = (idx) => {
      if (
        (!initialize && order[idx] === "display") ||
        device.length === order.length
      ) {
        mainWindow.webContents.send("initialization", { initialization: true });
      }
    };

    logger.info(
      `Initializing devices: ${[
        `fiscal ${connectedDevices?.fiscal?.model} ${connectedDevices?.fiscal?.version}`,
        ...(connectedDevices?.terminal?.map(
          (cur) => `terminal: ${cur.model} ${cur.version}`
        ) || [])
      ]}`
    );

    [
      ...order
        .filter((cur) => cur !== "terminal")
        .map((device) => require(`./${device}/initialize`)()),
      ...(connectedDevices?.terminal?.map((cur) =>
        require("./terminal/initialize")(cur.model, cur.version)
      ) || [])
    ].forEach(async (promise, idx) => {
      promise
        .then((data) => {
          if (!data?.model) {
            logger.error("Unknown model of unknown device initialized");
          }

          mainWindow.webContents.send(
            "initialization",
            order[idx] !== "terminal"
              ? { [order[idx]]: { status: true } }
              : {
                  [order[idx]]: {
                    status: true,
                    model: data.model || "unknown"
                  }
                }
          );
          require(`./${order[idx]}/index`)[data.model].init(data.body);
          device.push(data.model || order[idx] || true);
          checkDevices(idx);
        })
        .catch((error) => {
          if (!error?.model) {
            logger.error("Unknown model of unknown device didn't initialized");
            device.push(order[idx]);
            checkDevices(idx);
            return;
          }

          logger.warn(`Error with initialize: ${order[idx]}: ${error.model}`);
          mainWindow.webContents.send("initialization", {
            [order[idx]]: {
              error: { [error.critical ? "critical" : "warn"]: error.error },
              model: error.model
            }
          });
          device.push(error.model);
          checkDevices(idx);
        });
    });
  });
}

module.exports = {
  checkConnection,
  connectDatabase,
  checkIfLaunched,
  initializeDevices
};
