const { expect } = require('chai');
const { bookFactory } = require('../helpers/dataFactory');

describe('bookFactory', () => {
  it('generates random data', () => {
    const { title, author, ISBN, GenreId } = bookFactory();

    expect(typeof title).to.equal('string');
    expect(typeof author).to.equal('string');
    expect(typeof ISBN).to.equal('string');
    expect(ISBN.length).to.equal(13);
    expect(GenreId).to.equal(undefined);
  });

  it('returns passed data', () =>{
    const data = {
      title: 'Title',
      author: 'Author',
      ISBN: '1234567890123',
      genreId: 0
    };

    const { title, author, ISBN, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(ISBN).to.equal(data.ISBN);
    expect(GenreId).to.equal(data.genreId)
  });

  it('works with empty strings', () =>{
    const data = {
      title: '',
      author: '',
      ISBN: '',
      genreId: ''
    };

    const { title, author, ISBN, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(ISBN).to.equal(data.ISBN);
    expect(GenreId).to.equal(data.genreId)
  });

  it('works with null', () =>{
    const data = {
      title: null,
      author: null,
      ISBN: null,
      genreId: null
    };

    const { title, author, ISBN, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(ISBN).to.equal(data.ISBN);
    expect(GenreId).to.equal(data.genreId)
  });
});