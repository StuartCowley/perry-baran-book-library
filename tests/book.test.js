const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const data = {
          title: 'Book Title',
          author: 'Author Man',
          genre: 'Spooky',
          ISBN: '978-3-16-148410-0'
        }

        const response = await request(app).post('/books').send(data);
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
        const response = await request(app).post('/books').send({
          author: 'Author Man',
          genre: 'Spooky',
          ISBN: '978-3-16-148410-0'
        });

        expect(response.status).to.equal(500);
        expect(response.body.error[0]).to.equal('Book.title cannot be null');
      });

      it('contain an author', async () => {
        const response = await request(app).post('/books').send({
          title: 'title',
          genre: 'Spooky',
          ISBN: '978-3-16-148410-0'
        });

        expect(response.status).to.equal(500);
        expect(response.body.error[0]).to.equal('Book.author cannot be null');
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: 'Book Tidfds fds tle',
          author: 'Authodfsd fsd r Man',
          genre: 'Spookfd sdf sdy',
          ISBN: '978-3-16fds -148410-0'
        }),
        Book.create({
          title: 'Book fdf dsfds Title',
          author: 'Authd fds fdsor Man',
          genre: 'Spoof df sdf sky',
          ISBN: '978-3df sdfds fs-16-148410-0'
        }),
        Book.create({
          title: 'Book f sdhffdsTitle',
          author: 'Aut fdgfgfdghor Man',
          genre: 'Spoof sdf sdfky',
          ISBN: '978-3- dfsdf sed16-148410-0'
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        const response = await request(app).get('/books');

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
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books email by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: 'Arthur' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.author).to.equal('Arthur');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ author: 'Mike' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});