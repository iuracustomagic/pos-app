/* eslint-disable no-new */
/* eslint-disable global-require */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const multer = require("multer");
const axios = require("axios");
const { version } = require("../package.json");
const { JWT_SECRET, REPOSITORY_ID } = require("./env.json");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (req.route.path === "/settings/ad-img") {
      cb(null, process?.env?.IS_DEV ? "./public/ad" : "./resources/public/ad");
      return;
    }
    cb(
      null,
      process?.env?.IS_DEV ? "./public/images" : "./resources/public/images"
    );
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/bmp"
    ) {
      cb(null, true);
      return;
    }
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
}).single("image");

module.exports = {
  jwt: async (req, res, next) => {
    const nonSecurePaths = ["/users/login", "/settings/stop", "/"];
    if (nonSecurePaths.indexOf(req.path) !== -1) return next();
    try {
      req.jwt = jwt.verify(
        req.query?.jwt ?? req.body?.jwt ?? req.cookies?.jwt,
        JWT_SECRET
      );
      delete req?.body?.jwt;
      return next();
    } catch (error) {
      return res.status(500).send("Invalid Token");
    }
  },
  time: (time) =>
    `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}` +
    ` ${time.getHours()}:${
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
    }:` +
    `${time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}`,
  uploadImage: async (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(true);
    });
  },
  checkForUpdates: (versions, logger) => {
    logger.info(`Current app version: ${version}`);

    if (versions) {
      const checkVersion = versions.reduce(
        (prev, cur) =>
          +cur.name.replace(/\D/g, "") > prev && versions.release !== null
            ? cur.name
            : prev,
        +version.replace(/\D/g, "")
      );

      if (+version.replace(/\D/g, "") >= checkVersion) {
        return false;
      }

      logger.info(`Found fresh version - ${checkVersion}`);
      return checkVersion;
    }

    return false;
  },
  getTags: async (logger) => {
    try {

      const result = await axios.get(
        `https://git.agg.md/api/v4/projects/${REPOSITORY_ID}/repository/tags/`, {
          timeout: 2000,
        }
      );

      if (result.status !== 200) throw new Error("Incorrent answer");
      return result.data;
    } catch (error) {
      logger.error(`Error while trying to get GIT tags: ${error.message}`);
      return false;
    }
  },
  daysInMonth: (currentMonth, currentYear = new Date().getFullYear()) =>
    new Date(currentYear, currentMonth, 0).getDate(),
};
