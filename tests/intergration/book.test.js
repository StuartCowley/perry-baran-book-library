const { expect } = require('chai');
const { Book, Author } = require('../../src/models');
const { bookFactory, authorFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('/books', () => {
  let author;

  before(async () => await Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });

    author = await Author.create(authorFactory());
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const data = bookFactory({ authorId: author.id });

        const response = await appPost('/books', data);
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(data.title);
        expect(newBookRecord.title).to.equal(data.title);
        expect(newBookRecord.ISBN).to.equal(data.ISBN);
      });

      describe('title', () => {
        it('must contain a title', async () => {
          const data = bookFactory({ title: null, authorId: author.id });

          const response = await appPost('/books', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Must provide a book title');
        });

        it('title cannot be empty', async () => {
          const data = bookFactory({ title: '',  authorId: author.id });

          const response = await appPost('/books', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('The book title cannot be empty');
        });
      });

      describe('author', () => {
        it('must contain an authorId of a valid author', async () => {
          const data = bookFactory({ authorId: null });

          const response = await appPost('/books', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Book must have an author');
        });
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create(bookFactory({ authorId: author.id })),
        Book.create(bookFactory({ authorId: author.id })),
        Book.create(bookFactory({ authorId: author.id })),
      ]);
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        const response = await appGet('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0];
        const response = await appGet(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await appGet('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books by id', async () => {
        const book = books[0];
        
        const data = { title: 'Title' };

        const response = await appPatch(`/books/${book.id}`, data);
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal(data.title);
      });

      it('returns a 404 if the book does not exist', async () => {
        const data = { title: 'Title' };
        const response = await appPatch('/books/12345', data);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await appDelete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await appDelete('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});