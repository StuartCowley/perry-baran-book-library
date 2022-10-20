const helpers = require('./helpers');

exports.create = async (req, res) => {
  await helpers.create(req.body, res, 'book');
};

exports.readAll = async (_, res) => {
  await helpers.readAll(res, 'book');
};

exports.readById = async (req, res) => {
  const { bookId } = req.params;

  await helpers.readById(bookId, res, 'book');
};

exports.update = async (req, res) => {
  const { bookId } = req.params;

  await helpers.update(req.body, bookId, res, 'book');
};

exports.delete = async (req, res) => {
  const { bookId } = req.params;

  await helpers.delete(bookId, res, 'book');
}