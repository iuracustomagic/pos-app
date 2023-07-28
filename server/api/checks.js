/* eslint-disable camelcase */
const axios = require('axios');
const fs = require('fs');
const logger = require('../logger');

async function uploadChecks(data) {
  try {
    const { api_url } = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`, 'utf-8'));

    await axios.post(`${api_url}/api/cass?url=checks`, data);

    logger.info('Check has been uploaded successfully to the: http://dk-front.agg.md:81/api/cass?url=checks');

    return true;
  } catch (error) {
    const errored = JSON.parse(fs.readFileSync(`${process.env.extra}/server/errored.json`, 'utf-8'));
    fs.writeFileSync(`${process.env.extra}/server/errored.json`, JSON.stringify({ ...errored, checks: [...(errored.checks || []), ...data.checks] }, null, 2));
    return false;
  }
}

async function uploadReturned(data) {
  try {
    const { api_url } = JSON.parse(fs.readFileSync(`${process.env.extra}/server/appsettings.json`, 'utf-8'));

    await axios.post(`${api_url}/api/cass?url=checkReturn`, data);

    logger.info('Returned items have been uploaded successfully to the: http://dk-front.agg.md:81/api/cass?url=checkReturn');

    return true;
  } catch (error) {
    const errored = JSON.parse(fs.readFileSync(`${process.env.extra}/server/errored.json`, 'utf-8'));
    fs.writeFileSync(`${process.env.extra}/server/errored.json`, JSON.stringify({ ...errored, returned: [...(errored.returned || []), data] }, null, 2));
    return false;
  }
}

module.exports = {
  uploadChecks,
  uploadReturned,
};
