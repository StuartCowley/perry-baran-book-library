const { expect } = require('chai');
const { Book } = require('../../src/models');
const { bookFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const data = bookFactory();

        const response = await appPost('/books', data);
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal(data.title);
        expect(newBookRecord.title).to.equal(data.title);
        expect(newBookRecord.author).to.equal(data.author);
        expect(newBookRecord.genre).to.equal(data.genre);
        expect(newBookRecord.ISBN).to.equal(data.ISBN);
      });

      it('contain a title', async () => {
        const data = {
          author: 'Author Man',
          genre: 'Spooky',
          ISBN: '978-3-16-148410-0'
        };

        const response = await appPost('/books', data);

        expect(response.status).to.equal(500);
        expect(response.body.error[0]).to.equal('Book.title cannot be null');
      });

      it('contain an author', async () => {
        const data = {
          title: 'title',
          genre: 'Spooky',
          ISBN: '978-3-16-148410-0'          
        }
        const response = await appPost('/books', data);

        expect(response.status).to.equal(500);
        expect(response.body.error[0]).to.equal('Book.author cannot be null');
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create(bookFactory()),
        Book.create(bookFactory()),
        Book.create(bookFactory()),
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
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
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
        expect(response.body.author).to.equal(book.author);
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
      it('updates books email by id', async () => {
        const book = books[0];
        
        const data = { author: 'Arthur' };

        const response = await appPatch(`/books/${book.id}`, data);
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.author).to.equal(data.author);
      });

      it('returns a 404 if the book does not exist', async () => {
        const data = { author: 'Mike' }
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