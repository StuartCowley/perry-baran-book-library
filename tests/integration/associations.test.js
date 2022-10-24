const { expect } = require('chai');
const { Book, Genre, Author } = require('../../src/models');
const { bookFactory, genreFactory, authorFactory } = require('../helpers/dataFactory');
const { appGet } = require('../helpers/requestHelpers');

describe('associations', () => {
  let authors;
  let genres;
  let books;

  before(async () => {
    await Book.sequelize.sync();
    await Genre.sequelize.sync();
  });

  beforeEach(async () => {
    await Book.destroy({ where: {} });
    await Genre.destroy({ where: {} });

    authors = await Promise.all([
      Author.create(authorFactory()),
      Author.create(authorFactory()),
    ]);

    genres = await Promise.all([
      Genre.create(genreFactory()),
      Genre.create(genreFactory()),
    ]);

    books = await Promise.all([
      Book.create(bookFactory({ genreId: genres[0].id, authorId: authors[0].id })),
      Book.create(bookFactory({ genreId: genres[0].id, authorId: authors[0].id })),
      Book.create(bookFactory({ genreId: genres[1].id, authorId: authors[1].id })),
    ])
  });

  describe('/books', () => {
    describe('GET /books', () => {
      it('returns associated genres', async () => {
        const response = await appGet(`/books`);

        expect(response.status).to.equal(200);
        
        response.body.forEach((book) => {
          const expectedGenre = genres.find((genre) => genre.id === book.GenreId);
          
          expect(book.GenreId).to.equal(expectedGenre.id);
          expect(book.Genre.genre).to.equal(expectedGenre.genre);
        });
      });

      it('returns associated authors', async () => {
        const response = await appGet(`/books`);

        expect(response.status).to.equal(200);
        
        response.body.forEach((book) => {
          const expectedAuthor = authors.find((author) => author.id === book.AuthorId);

          expect(book.AuthorId).to.equal(expectedAuthor.id);
          expect(book.Author.author).to.equal(expectedAuthor.author);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('returns associated genre', async () => {
        const book = books[0];
        const genre = genres[0]
        const response = await appGet(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.GenreId).to.equal(genre.id);
        expect(response.body.Genre.id).to.equal(genre.id);
        expect(response.body.Genre.genre).to.equal(genre.genre);
      });
      
      it('returns associated author', async () => {
        const book = books[0];
        const author = authors[0]
        const response = await appGet(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.AuthorId).to.equal(author.id);
        expect(response.body.Author.id).to.equal(author.id);
        expect(response.body.Author.author).to.equal(author.author);
      });     
    });
  });

  describe('/genres', () => {
    describe('GET /genres', () => {
      it('returns associated books and authors', async () => {
        const response = await appGet('/genres');

        expect(response.status).to.equal(200);
        
        response.body.forEach((genre) => {
          const booksArray = books.filter((book) => book.GenreId === genre.id);

          expect(booksArray.length).to.equal(genre.Books.length);

          genre.Books.forEach((book) => {
            const expectedBook = books.find((a) => a.id === book.id);
            const expectedAuthor = authors.find((author) => author.id === book.AuthorId);
            
            expect(expectedBook.title).to.equal(book.title);
            expect(expectedBook.ISBN).to.equal(book.ISBN);
            expect(expectedAuthor.author).to.equal(book.Author.author);
          });
        });
      }); 
    });

    describe('GET /genres/:id', () => {
      it('return associated books and authors', async () => {
        const genre = genres[0];
        const response = await appGet(`/genres/${genre.id}`);

        const filteredBooks = books.filter((book) => book.GenreId === genre.id);

        expect(response.status).to.equal(200);
        expect(response.body.Books.length).to.equal(filteredBooks.length);

        response.body.Books.forEach((book) => {
          const expectedBook = filteredBooks.find((a) => a.id === book.id);
          const expectedAuthor = authors.find((author) => author.id === expectedBook.AuthorId);

          expect(book.title).to.equal(expectedBook.title);
          expect(book.ISBN).to.equal(expectedBook.ISBN);
          expect(book.Author.author).to.equal(expectedAuthor.author);
        });
      });
    });
  });

  describe('/authors', () => {
    describe('GET /authors', () => {
      it('returns associated books and genre', async () => {
        const response = await appGet('/authors')

        expect(response.status).to.equal(200);

        response.body.forEach((author) => {
          const booksArray = books.filter((book) => book.AuthorId === author.id);

          expect(booksArray.length).to.equal(author.Books.length);

          author.Books.forEach((book) => {
            const expectedBook = books.find((a) => a.id === book.id);
            const expectedGenre = genres.find((genre) => genre.id === book.GenreId);

            expect(expectedBook.title).to.equal(book.title);
            expect(expectedBook.ISBN).to.equal(book.ISBN);
            expect(expectedGenre.genre).to.equal(book.Genre.genre);
          });
        });
      });
    });

    describe('GET /authors/:id', async () => {
      it('returns associated books and genres', async () => {
        const author = authors[0];
        const response = await appGet(`/authors/${author.id}`);

        const filteredBooks = books.filter((book) => book.AuthorId === author.id);

        expect(response.status).to.equal(200);
        expect(response.body.Books.length).to.equal(filteredBooks.length);

        response.body.Books.forEach((book) => {
          const expectedBook = filteredBooks.find((a) => a.id === book.id);
          const expectedGenre = genres.find((genre) => genre.id === book.GenreId);

          expect(book.title).to.equal(expectedBook.title);
          expect(book.ISBN).to.equal(expectedBook.ISBN);
          expect(book.Genre.genre).to.equal(expectedGenre.genre);
        });
      });
    });
  });
});