const Sequelize = require('sequelize');
const { Reader } = require('../models');

exports.create = async (req, res) => {
  const readerData = req.body;
  
  const newReader = await Reader.create(readerData);
  res.status(201).json(newReader);
};