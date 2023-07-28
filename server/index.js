/* eslint-disable global-require */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { exec } = require("child_process");
const logger = require("./logger");
const { SERVER_PORT } = require("./env.json");
const app = express();
if (process.env.SERVER) require("./initialize");

const {
  userRouter,
  settingRouter,
  categoryRouter,
  inventoryRouter,
  transactionRouter,
  setupRouter,
  fiscalRouter,
} = require("./router/index");

app.use(require("cookie-parser")());
app.use(
  require("cors")({
    origin: ["http://localhost:3000", "http://localhost:5500"],
  })
);
app.use(express.static(path.join(__dirname, "/../build")));
app.use(express.static(path.join(process.env.extra, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./helpers").jwt);

app.use(userRouter);
app.use(categoryRouter);
app.use(inventoryRouter);
app.use(settingRouter);
app.use(transactionRouter);
app.use(setupRouter);
app.use(fiscalRouter);

module.exports = new Promise((resolve, reject) => {
  exec(`curl http://127.0.0.1:${SERVER_PORT || 5500}`, (error, stdout) => {
    if (stdout) {
      reject(
        new Error(
          "The server is already launched, please restart the computer or turn off the process of this app"
        )
      );
      return;
    }

    app.listen(SERVER_PORT || 5500, () => {
      logger.info(`Server has been started on port ${SERVER_PORT || 5500}`);
      resolve();
    });
  });
});
