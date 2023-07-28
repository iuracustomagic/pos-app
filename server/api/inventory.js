/* eslint-disable no-loop-func */
/* eslint-disable no-empty */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-constant-condition */
/* eslint-disable camelcase */
const axios = require("axios");
const fs = require("fs");
const logger = require("../logger");
const { product, discount } = require("../schema/index");
const { daysInMonth } = require("../helpers");
const { turned_off } = require(`${process.env.extra}/server/appsettings.json`);
const [year, month, day] = turned_off
  ? turned_off.split("-").map((cur) => +cur)
  : [undefined, undefined, undefined];
let promiseInventory = null;
let resolverInventory = null;

async function uploadInventory(
  mainWindow = false,
  date = false,
  startPosition = 1
) {
  try {
    const { api_url } = JSON.parse(
      fs.readFileSync(`${process.env.extra}/server/appsettings.json`, "utf-8")
    );
    const response = await axios.get(
      `${api_url}/?url=getNom&page=${startPosition}${
        date === false ? "&date=01-01-2023" : `&date=${date}` // Remove &01-01-2023
      }&Warehous=7.1`,
      {
        headers: {
          Authorization: `Basic ${btoa(`exchange:saturn`)} } `
        },
        timeout: 3000
      }
    );

    if (response.data.length === 0) {
      resolverInventory();
      return;
    }

    try {
      await product.bulkWrite(
        (response.data || []).map((cur) => ({
          updateOne: {
            filter: { _id: cur._id },
            update: { $set: cur },
            upsert: true
          }
        })),
        { ordered: false }
      );
    } catch (err) {
      logger.error(
        `Failed to write this chunk of nomenclatures: ${startPosition}`
      );
    }

    if (mainWindow) {
      mainWindow.send(
        "initialization-status",
        `Fetching nomenclature chunks${
          date !== false ? ` from date: ${date} ` : ""
        }, current chunk: ${startPosition}`
      );
    }

    uploadInventory(mainWindow, date, startPosition + 1);
  } catch (error) {
    logger.error(
      `An error while trying to get nomenclatures from index ${startPosition}${
        date !== false ? `, from date: ${date}` : ""
      }, error message: ${error.message}`
    );

    if (mainWindow) {
      mainWindow.send(
        "initialization-status",
        `Can't get the api address, errored on page: ${startPosition}${
          date !== false ? ` from date: ${date}` : ""
        }`
      );

      setTimeout(() => {
        resolverInventory();
      }, 2500);
    }
  }
}

async function uploadInventoryAll(mainWindow) {
  try {
    promiseInventory = new Promise((resolve) => {
      resolverInventory = resolve;
    });
    uploadInventory(mainWindow);
    try {
      await promiseInventory;
    } catch {}

    return true;
  } catch (error) {
    return false;
  }
}

async function updateInventory(mainWindow) {
  let daysInCurrentMonth = daysInMonth(month);
  let tempDaysInCurrentMonth = daysInCurrentMonth;
  const today = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .map((cur) => +cur)
    .join("-");
  const tempDate = [year, month, day];
  let [tempYear, tempMonth, tempDay] = tempDate;
  let howManyDaysLeft = 0;

  if (!turned_off) {
    return false;
  }

  while (true) {
    if (tempDate.join("-") === today) {
      break;
    }

    tempDate[2]++;
    howManyDaysLeft++;

    if (tempDate[2] > tempDaysInCurrentMonth) {
      if (tempDate[1] >= 12) {
        tempDate[0]++;
        tempDate[1] = 0;
      }

      tempDate[2] = 0;
      tempDate[1]++;
      tempDaysInCurrentMonth = daysInMonth(tempDate[1]);
    }

    if (howManyDaysLeft > 5) {
      logger.info("Left more than 5 days, downloading all nomenclatures");
      await uploadInventoryAll(mainWindow);
      return true;
    }
  }

  while (true) {
    if (`${tempYear}-${tempMonth}-${tempDay}` === today) {
      break;
    }

    tempDay++;

    if (day > daysInCurrentMonth) {
      daysInCurrentMonth = daysInMonth(month + 1);
      tempMonth++;
      tempDay = 0;

      if (tempMonth > 12) {
        tempYear++;
        tempMonth = 1;
      }
    }

    const iterationDate = `${tempYear}-${tempMonth}-${tempDay}`;

    promiseInventory = new Promise((resolve) => {
      resolverInventory = resolve;
    });

    try {
      uploadInventory(mainWindow, iterationDate);
      await promiseInventory;
    } catch {}
  }

  return true;
}

async function updateDiscount() {
  return true;
}

async function uploadDiscount() {
  try {
    const data = await axios().then((res) => res);

    await data.map(async (cur) => {
      await discount.updateOne({ name: cur.id }, cur);
    });

    return true;
  } catch (error) {
    logger.error(error.message);
    return false;
  }
}

module.exports = {
  uploadDiscount,
  updateInventory,
  updateDiscount,
  uploadInventoryAll
};
