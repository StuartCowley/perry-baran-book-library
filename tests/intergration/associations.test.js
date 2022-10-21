const { expect } = require('chai');
const { Book, Genre } = require('../../src/models');
const { bookFactory, genreFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('associations', () => {
  let genres;
  let books;

  before(async () => {
    await Book.sequelize.sync();
    await Genre.sequelize.sync();
  });

  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Genre.destroy({ where: {} });

    genres = await Promise.all([
      Genre.create(genreFactory()),
      Genre.create(genreFactory()),
    ]);

    books = await Promise.all([
      Book.create(bookFactory({ genreId: genres[0].id })),
      Book.create(bookFactory({ genreId: genres[0].id })),
      Book.create(bookFactory({ genreId: genres[1].id })),
    ])
  });

  describe('/books', () => {
    describe('GET /books', () => {
      it('returns all books and associated genres', async () => {
        const response = await appGet(`/books`);

        expect(response.status).to.equal(200);
        
        response.body.forEach((book) => {
          const expectedGenre = genres.find((genre) => genre.id === book.GenreId);
          
          expect(book.GenreId).to.equal(expectedGenre.id);
          expect(expectedGenre.genre).to.equal(book.Genre.genre);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('returns genre associated with the book', async () => {
        const book = books[0];
        const response = await appGet(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.GenreId).to.equal(genres[0].id);
        expect(response.body.Genre.id).to.equal(genres[0].id);
        expect(response.body.Genre.genre).to.equal(genres[0].genre);
      });      
    });
  });

  describe('/genres', () => {
    describe('GET /genres', () => {
      it('returns all genres and associated books', async () => {
        const response = await appGet('/genres');

        expect(response.status).to.equal(200);
        
        response.body.forEach((genre) => {
          const booksArray = books.filter((book) => book.GenreId === genre.id);

          expect(booksArray.length).to.equal(genre.Books.length);

          booksArray.forEach((book) => {
            const expectedBook = books.find((a) => a.id === book.id);
            
            expect(expectedBook.title).to.equal(book.title);
            expect(expectedBook.ISBN).to.equal(book.ISBN);
          });
        });
      }); 
    });

    describe('GET /genres/:id', () => {
      it('return all books associated with the genre', async () => {
        const genre = genres[0];
        const response = await appGet(`/genres/${genre.id}`);

        const filteredBooks = books.filter((book) => book.GenreId === genre.id);

        expect(response.status).to.equal(200);
        expect(response.body.Books.length).to.equal(filteredBooks.length);

        response.body.Books.forEach((book) => {
          const expected = filteredBooks.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });      
    });
  });
});