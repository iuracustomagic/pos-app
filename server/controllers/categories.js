const fs = require('fs');
const logger = require('../logger');
const { updateIfCategoryWasEditted } = require('./inventory');
const categories = JSON.parse(fs.readFileSync(`${process.env.extra}/server/categories.json`).toString());

async function addNewCategory(req, res) {
  try {
    if (!req.jwt.data?.admin) throw new Error('You don\'t have permissions');
    if (categories.some((category) => category.name.toLowerCase() === req.body.category.toLowerCase())) {
      throw new Error('This categoty is already existing!');
    }

    categories.push({ name: req.body.category.toLowerCase(), popularity: 0 });

    const JSONformat = JSON.stringify(categories);

    fs.writeFile(`${process.env.extra}/server/categories.json`, JSONformat, 'utf-8', (err) => {
      if (err) throw new Error('Can\'t add a new category');
      res.send(JSONformat);
    });
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function deleteCategory(req, res) {
  try {
    if (!req.jwt.data?.admin) throw new Error('You don\'t have permissions');
    const index = categories.findIndex((cur) => cur.name === req.query.category);
    if (index < 0) {
      throw new Error('This category doesn\'t exists');
    }
    categories.splice(index, 1);

    const JSONformat = JSON.stringify(categories);

    fs.writeFile(`${process.env.extra}/server/categories.json`, JSONformat, 'utf-8', (err) => {
      if (err) throw new Error(err);
      res.send(JSONformat);
    });
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function updateCategory(req, res) {
  try {
    if (!req.jwt.data?.admin) throw new Error('You don\'t have permissions');
    const index = categories.findIndex((cur) => cur.name === req.query.updateCategory);
    if (index === -1) throw new Error('This category doesn\'t exists');
    const sameCategory = categories.some((category) => category.name.toLowerCase() === req.query.category.toLowerCase());
    if (sameCategory) throw new Error('You can\'t rename a category, it already exists');
    await updateIfCategoryWasEditted(categories[index].name, req.query.category);
    categories[index].name = req.query.category;

    const JSONformat = JSON.stringify(categories);

    fs.writeFile(`${process.env.extra}/server/categories.json`, JSONformat, 'utf-8', (err) => {
      if (err) throw new Error('Can\'t delete a category');
      res.send(JSONformat);
    });
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function getAllCategories(req, res) {
  res.send(JSON.stringify(categories.sort((a, b) => b.popularity - a.popularity)));
}

module.exports = {
  getAllCategories,
  addNewCategory,
  deleteCategory,
  updateCategory,
};
