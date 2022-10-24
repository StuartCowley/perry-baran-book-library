const helpers = require('./helpers');

exports.create = async (req, res) => {
  try {
    await helpers.create(req.body, res, 'author');
  } catch (err) {
    throw new Error(err);
  };
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'author');
  } catch (err) {
    throw new Error(err);
  };
};

exports.readById = async (req, res) => {
  const { authorId } = req.params;

  try {
    await helpers.readById(authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  };
};

exports.update = async (req, res) => {
  const { authorId } = req.params;

  try {
    await helpers.update(req.body, authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  };
};

exports.delete = async (req, res) => {
  const { authorId } = req.params;

  try {
    await helpers.delete(authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  };
};