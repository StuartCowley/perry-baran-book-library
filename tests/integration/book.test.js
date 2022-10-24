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

      describe('authorId', () => {
        it('must contain an authorId of a valid author', async () => {
          const data = bookFactory({ authorId: null });

          const response = await appPost('/books', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Book must have an author');
        });
      });

      describe('ISBN', () => {
        it('must be unique', async () => {
          const data = bookFactory({ ISBN: '978-1-1234-1234-1', authorId: author.id});

          await appPost('/books', data);
          const response = await appPost('/books', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be unique');
        });

        it('can be valid ISBN13', async () => {
          const data = bookFactory({ ISBN: '978-1-1234-1234-1', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(201);
        });

        it('can be valid ISBN10', async () => {
          const data = bookFactory({ ISBN: '0-7960-0165-0', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(201);
        });

        it('can be ISBN13 without dashes', async () => {
          const data = bookFactory({ ISBN: '9781123412341', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(201);
        });

        it('can be ISBN10 without dashes', async () => {
          const data = bookFactory({ ISBN: '0796001650', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(201);
        });

        it('cannot be a numberic string not containing less than 10 numbers', async () => {
          const data = bookFactory({ ISBN: '079600165', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot be a numberic string not containing more than 13 numbers', async () => {
          const data = bookFactory({ ISBN: '97811234123413', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot be a numberic string not containing 11 or 12 numbers', async () => {
          const data1 = bookFactory({ ISBN: '97845678901', authorId: author.id});
          const data2 = bookFactory({ ISBN: '978456789012', authorId: author.id});

          const response1 = await appPost('/books', data1);
          const response2 = await appPost('/books', data2);

          expect(response1.status).to.equal(500);
          expect(response1.body.error[0]).to.equal('ISBN must be of valid format');
          expect(response2.status).to.equal(500);
          expect(response2.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot contain any non numeric characters', async () => {
          const data = bookFactory({ ISBN: '978-1-1234-1a34-1', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot start with anything other than 978 or 979 for ISBN13', async () => {
          const data = bookFactory({ ISBN: '976-1-1234-1434-1', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot contain more than 4 dashes', async () => {
          const data = bookFactory({ ISBN: '978-1-1234-14-34-1', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
        });

        it('cannot less than 4 but more than 0 dashes', async () => {
          const data = bookFactory({ ISBN: '978-1-123414-341', authorId: author.id});

          const response = await appPost('/books', data);
          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('ISBN must be of valid format');
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