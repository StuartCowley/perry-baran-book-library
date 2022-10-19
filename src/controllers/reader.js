const Sequelize = require('sequelize');
const { Reader } = require('../models');

exports.create = async (req, res) => {
  const data = req.body;
  
  try {
    const newReader = await Reader.create(data);
    res.status(201).json(newReader);
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.readAll = async (_, res) => {
  try {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.readById = async (req, res) => {
  const { readerId } = req.params;
  
  try {
    const reader = await Reader.findByPk(readerId);

    if (!reader) {
      res.status(404).json({ error: 'The reader could not be found.' });
    } else {
      res.status(200).json(reader);
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.update = async (req, res) => {
  const { readerId } = req.params;
  const data = req.body

  try {
    const [ updatedRows ] = await Reader.update(data, { where: { id: readerId } });

    if (!updatedRows) {
      res.status(404).json({ error: 'The reader could not be found.' })
    } else {
      res.status(200).send();
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.delete = async (req, res) => {
  const { readerId } = req.params;

  try {
    const deletedRows = await Reader.destroy({where: {id: readerId } });
    if (!deletedRows) {
      res.status(404).json({ error: 'The reader could not be found.' })
    } else {
      res.status(204).send();
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  }
}