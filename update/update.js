/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const DecompressZip = require('decompress-zip');
const { exec } = require('child_process');
const { REPOSITORY_NAME, REPOSITORY_GROUP } = require('../server/env.json');
const { killProcess } = require('../server/controllers/settings');

module.exports = (updateVersion, logger, mainWindow) => {
  process.noAsar = true;

  const targetFolder = process.env.IS_DEV ? __dirname : path.resolve(process.env.extra, '../');
  const sourceFolder = process.env.IS_DEV ? `${__dirname}/version.zip` : path.resolve(process.env.extra, '../', 'version.zip');
  const writer = fs.createWriteStream(sourceFolder);

  logger.info(`Started to download an update: ${updateVersion}`);

  axios({
    method: 'get',
    url: `https://git.agg.md/${REPOSITORY_GROUP}/${REPOSITORY_NAME}/-/archive/${updateVersion}/${REPOSITORY_NAME}-${updateVersion}.zip`,
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.progress) {
        const percentCompleted = Math.round(progressEvent.progress * 100);
        logger.info(`Downloaded ${percentCompleted}% of the file.`);
        mainWindow.webContents.send('initialization-status', `Downloading the fresh version: ${percentCompleted}% of the file.`);
        return;
      }

      mainWindow.webContents.send('initialization-status', 'Downloading the app...');
    },
  }).then((response) => {
    response.data.pipe(writer);
  }).catch(() => {
    killProcess();
  });

  writer.on('finish', () => {
    const unzipper = new DecompressZip(sourceFolder);

    unzipper.on('error', () => {
      process.noAsar = false;
      logger.error('Error while trying to extract from zip');
    });

    unzipper.on('extract', () => {
      logger.info('Closing the app to replace files and update it');
      exec(`start "${targetFolder}/update.exe"`);
      killProcess();
    });

    unzipper.on('progress', (fileIndex, fileCount) => {
      logger.info(`Extracted file ${fileIndex + 1} of ${fileCount}`);
    });

    unzipper.extract({
      path: targetFolder,
    });
  });
};
