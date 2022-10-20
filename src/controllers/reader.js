const helpers = require('./helpers');

exports.create = async (req, res) => {
  await helpers.create(req.body, res, 'reader');
};

exports.readAll = async (_, res) => {
  await helpers.readAll(res, 'reader');
};

exports.readById = async (req, res) => {
  const { readerId } = req.params;
  
  await helpers.readById(readerId, res, 'reader');
};

exports.update = async (req, res) => {
  const { readerId } = req.params;

  await helpers.update(req.body, readerId, res, 'reader');
};

exports.delete = async (req, res) => {
  const { readerId } = req.params;

  await helpers.delete(readerId, res, 'reader');
}