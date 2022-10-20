const helpers = require('./helpers');

exports.create = async (req, res) => {
  await helpers.create(req.body, res, 'author');
};

exports.readAll = async (_, res) => {
  await helpers.readAll(res, 'author');
};

exports.readById = async (req, res) => {
  const { authorId } = req.params;

  await helpers.readById(authorId, res, 'author');
};

exports.update = async (req, res) => {
  const { authorId } = req.params;

  await helpers.update(req.body, authorId, res, 'author');
};

exports.delete = async (req, res) => {
  const { authorId } = req.params;

  await helpers.delete(authorId, res, 'author');
};