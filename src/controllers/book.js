const Sequelize = require('sequelize');
const { Book } = require('../models');

exports.create = async (req, res) => {
  const data = req.body;
  
  try {
    const newBook = await Book.create(data);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err });
  };
};

exports.readAll = async (_, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err });
  };
};

exports.readById = async (req, res) => {
  const { bookId } = req.params;
  
  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      res.status(404).json({ error: 'The book could not be found.' });
    } else {
      res.status(200).json(book);
    };
  } catch (err) {
    res.status(500).json({ error: err });
  };
};

exports.update = async (req, res) => {
  const { bookId } = req.params;
  const data = req.body

  try {
    const [ updatedRows ] = await Book.update(data, { where: { id: bookId } });

    if (!updatedRows) {
      res.status(404).json({ error: 'The book could not be found.' })
    } else {
      res.status(200).send();
    };
  } catch (err) {
    res.status(500).json({ error: err });
  };
};

exports.delete = async (req, res) => {
  const { bookId } = req.params;

  try {
    const deletedRows = await Book.destroy({where: {id: bookId } });
    if (!deletedRows) {
      res.status(404).json({ error: 'The book could not be found.' })
    } else {
      res.status(204).send();
    };
  } catch (err) {
    res.status(500).json({ error: err });
  }
}