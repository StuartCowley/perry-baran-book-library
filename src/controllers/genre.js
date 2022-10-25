const helpers = require('./helpers');

exports.create = async (req, res) => {
  try {
    await helpers.create(req.body, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { genreId } = req.params;

  try {
    await helpers.readById(genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const { genreId } = req.params;

  try {
    await helpers.update(req.body, genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { genreId } = req.params;

  try {
    await helpers.delete(genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};