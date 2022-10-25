const helpers = require('./helpers');

exports.create = async (req, res) => {
  try {
    await helpers.create(req.body, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { readerId } = req.params;
  
  try {
    await helpers.readById(readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const { readerId } = req.params;

  try {
    await helpers.update(req.body, readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { readerId } = req.params;

  try {
    await helpers.delete(readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};