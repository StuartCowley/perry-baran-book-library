const helpers = require('./helpers');

exports.create = async (req, res) => {
  await helpers.create(req.body, res, 'genre');
};

exports.readAll = async (_, res) => {
  await helpers.readAll(res, 'genre');
};

exports.readById = async (req, res) => {
  const { genreId } = req.params;

  await helpers.readById(genreId, res, 'genre');
};

exports.update = async (req, res) => {
  const { genreId } = req.params;

  await helpers.update(req.body, genreId, res, 'genre');
};

exports.delete = async (req, res) => {
  const { genreId } = req.params;

  await helpers.delete(genreId, res, 'genre');
};