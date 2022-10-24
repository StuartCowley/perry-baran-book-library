const { expect } = require('chai');
const { bookFactory } = require('../helpers/dataFactory');

describe('bookFactory', () => {
  it('generates random data', () => {
    const { title, ISBN, AuthorId, GenreId } = bookFactory();

    expect(typeof title).to.equal('string');
    expect(typeof ISBN).to.equal('string');
    expect(ISBN.length).to.equal(17);
    expect(ISBN).to.match(/^(?:ISBN(?:-1[03])?:?)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-]){3})[-0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-]){4})[-0-9]{17}$)(?:97[89][-]?)?[0-9]{1,5}[-]?[0-9]+[-]?[0-9]+[-]?[0-9X]$/gm);
    expect(AuthorId).to.equal(undefined);
    expect(GenreId).to.equal(undefined);
  });

  it('returns passed data', () =>{
    const data = {
      title: 'Title',
      ISBN: '1234567890123',
      authorId: 0,
      genreId: 0
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId);
  });

  it('works with empty strings', () =>{
    const data = {
      title: '',
      author: '',
      ISBN: '',
      authorId: '',
      genreId: ''
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId)
  });

  it('works with null', () =>{
    const data = {
      title: null,
      author: null,
      ISBN: null,
      authorId: null,
      genreId: null
    };

    const { title, ISBN, AuthorId, GenreId } = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(ISBN).to.equal(data.ISBN);
    expect(AuthorId).to.equal(data.authorId);
    expect(GenreId).to.equal(data.genreId)
  });
});