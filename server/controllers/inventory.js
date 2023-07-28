/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable consistent-return */
const fs = require("fs");
const logger = require("../logger");
const { product, card } = require("../schema/index");
const { PRODUCTS_DISPLAY } = require("../env.json");

async function getProducts(req, res) {
  try {
    const filter = JSON.parse(req.query.filter);
     console.log(filter)
    const result = await product.aggregate([
      { $match:  filter },
      ...(req.query.unwind === "false" ? [] : [{ $unwind: "$addition" }]),
      { $sort: { "addition.popularity": -1 } },
      { $skip: +req.query.state },
      { $limit: PRODUCTS_DISPLAY + 1 },
      {
        $lookup: {
          from: "discounts",
          foreignField: "_id",
          localField: "discount",
          as: "discount"
        }
      },
      {
        $replaceWith: {
          $mergeObjects: [
            "$$ROOT",
            ...(req.query.unwind === "false"
              ? []
              : ["$addition", { addition: null }])
          ]
        }
      }
    ]);

    if (req.query.total) {
      const [total] = await product.aggregate([
        { $unwind: "$addition" },
        { $match: JSON.parse(req.query.filter) },
        { $count: "total" }
      ]);

      res.send({
        products: result,
        ...total
      });

      return;
    }

    res.send({ products: result });
  } catch (error) {
    logger.info(error.message);
    res.status(500).send(error.message);
  }
}

async function getProductByFilter(req, res) {
  try {
    const filter = JSON.parse(req.query.filter || "{}");
    const [result] = await product.aggregate([
      { $unwind: "$addition" },
      { $match: { "addition.barcode": filter.barcode } },
      {
        $lookup: {
          from: "discounts",
          foreignField: "_id",
          localField: "discount",
          as: "discount"
        }
      },
      // {
      //   $set: {
      //     discount: { $arrayElemAt: ["$discount", 0] }
      //   }
      // },
      {
        $replaceWith: {
          $mergeObjects: ["$addition", "$$ROOT", { addition: null }]
        }
      }
    ]);

    if (!result) {
      if (!filter.barcode) {
        throw new Error("Nothing to search!");
      }

      const discountCard = await card.findOne({ code: filter.barcode });

      if (discountCard) {
        res.send({
          discount: discountCard
        });

        return;
      }

      throw new Error("Продукт не найден!");
    }

    res.send({
      product: result
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function addProduct(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error("You don't have this permission");
    const [recordsAmmount] = await product.aggregate([
      { $unwind: "$addition" },
      { $count: "total" }
    ]);

    await product.create({
      ...req.body.data,
      addition: (req.body.data.addition || []).map((cur) => ({
        ...cur,
        popularity: +(1 - 1 / recordsAmmount.total).toFixed(5)
      }))
    });

    res.send(true);
  } catch (error) {
    logger.info(error.message);

    res.status(500).send("An error occurred while adding a product");
  }
}

async function updateProduct(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error("You don't have this permission");

    if (req.body.data.oldImg) {
      const dir = fs.readdirSync(`${process.env.extra}/public/images`);

      if (dir.indexOf(req.body.data.oldImg) > -1) {
        fs.unlinkSync(
          `${process.env.extra}/public/images/${req.body.data.oldImg}`
        );
      }

      delete req.body.data.oldImg;
    }

    if (!req.body.data.discount?.length) {
      delete req.body.data.discount;
    }

    await product.updateOne({ _id: req.body.data._id }, req.body.data);
    res.send(true);
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function deleteProduct(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error("You don't have this permission");
    const result = await product.deleteOne({ _id: req.query.id });
    if (result.deletedCount !== 1)
      throw new Error("Didn't found a product to delete");
    if (req.query.img !== "default.jpg") {
      fs.unlinkSync(
        `${process.env.extra}/public/images/${req.query.img}`,
        (err) => {
          if (err) throw err;
        }
      );
    }
    res.send(true);
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function updateIfCategoryWasEditted(category, newCategory) {
  try {
    const result = await product.updateMany(
      { category },
      { category: newCategory }
    );
    return result;
  } catch (error) {
    logger.info(error.message);

    return error;
  }
}

module.exports = {
  getProducts,
  getProductByFilter,
  updateProduct,
  addProduct,
  deleteProduct,
  updateIfCategoryWasEditted
};
