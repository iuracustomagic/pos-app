/* eslint-disable no-underscore-dangle */
/* eslint-disable import/newline-after-import */
const fs = require('fs');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { JWT_SECRET } = require('../env.json');
const { user } = require('../schema/index');
const timeFormatter = require('../helpers').time;
const toDaysDay = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
const time = JSON.parse(fs.readFileSync(`${process.env.extra}/server/time.json`).toString());

async function logging(req, res) {
  try {
    const userMatch = await user.findOne({ code: req.body.code });
    if (userMatch === null) throw new Error('This code deosn\'t exists');
    const jwtSign = jwt.sign({ data: userMatch }, JWT_SECRET);
    res.cookie('jwt', jwtSign).send(jwtSign);
    await userMatch.updateOne({ loggedIn: new Date() });
    await userMatch.save();
    if (!time[toDaysDay]) time[toDaysDay] = {};
    const userTime = time[toDaysDay][`${userMatch.code}, ${userMatch.username || 'User'}`];
    time[toDaysDay][`${userMatch.code}, ${userMatch.username || 'User'}`] = (userTime || []).concat({ in: timeFormatter(new Date()) });

    fs.writeFile(`${process.env.extra}/server/time.json`, JSON.stringify(time, null, 2), 'utf-8', (err) => {
      if (err) throw err;
    });
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function logout(req, res) {
  try {
    const result = await user.findById(req.jwt.data._id);
    await result.updateOne({ loggedOut: new Date() });
    await result.save();

    if (!time[toDaysDay]) time[toDaysDay] = {};
    const userTime = time[toDaysDay][`${result.code}, ${result.username || 'User'}`];
    time[toDaysDay][`${result.code}, ${result.username || 'User'}`][userTime.length - 1].out = timeFormatter(new Date());

    fs.writeFileSync(`${process.env.extra}/server/time.json`, JSON.stringify(time, null, 2), 'utf-8', (err) => {
      if (err) throw err;
    });

    res.send(true);
  } catch (error) {
    logger.info(error.message);

    res.status(500).send('Error during exit');
  }
}

async function registering(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error('You don\'t have permission to create users');
    await user.create({ ...req.body, username: req.body?.username || 'User' });
    res.send('User has been reggistered successfully!');
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error?.message ? error.message : 'Error while registering');
  }
}

async function getUserById(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error('You don\'t have permission to create users');
    const result = await user.findById(req.query._id);
    res.send(JSON.stringify(result));
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function getAllUsers(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error('You don\'t have permission to create users');
    const result = await user.find({}).lean();
    res.send(JSON.stringify(result));
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error.message);
  }
}

async function deleteUserById(req, res) {
  try {
    if (!req.jwt.data.admin) throw new Error('You don\'t have permission to create users');
    const result = await user.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 0) throw new Error('User hasn\'t been deleted!');
    res.send(true);
  } catch (error) {
    logger.info(error.message);

    res.send(500).send(error.message);
  }
}

async function updateUser(req, res) {
  try {
    console.log(req.body.data)
    if (!req.jwt.data.admin) throw new Error('You don\'t have permission to create users');

    const result = await user.updateOne({ _id: req.body.data.id }, req.body.data);
    if (result.modifiedCount === 0) throw new Error('No user was updated');
    if (result.matchedCount === 0) throw new Error('No users found to update');

    const userMacth = await user.findById(req.body.data.id);
    res.send(jwt.sign({ data: userMacth }, JWT_SECRET));
  } catch (error) {
    logger.info(error.message);

    res.status(500).send(error?.message ? error.message : 'Error while updating the user');
  }
}

module.exports = {
  logging,
  logout,
  registering,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUser,
};
