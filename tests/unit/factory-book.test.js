const { expect } = require('chai');
const { bookFactory } = require('../helpers/dataFactory');

describe('bookFactory', () => {
  it('generates random data', () => {
    const {title, author, genre, ISBN} = bookFactory();

    expect(typeof title).to.equal('string');
    expect(typeof author).to.equal('string');
    expect(typeof genre).to.equal('string');
    expect(typeof ISBN).to.equal('string');
    expect(ISBN.length).to.equal(13);
  });

  it('returns passed data', () =>{
    const data = {
      title: 'Title',
      author: 'Author',
      genre: 'Genre',
      ISBN: '1234567890123'
    };

    const {title, author, genre, ISBN} = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(genre).to.equal(data.genre);
    expect(ISBN).to.equal(data.ISBN);
  });

  it('works with empty strings', () =>{
    const data = {
      title: '',
      author: '',
      genre: '',
      ISBN: ''
    };

    const {title, author, genre, ISBN} = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(genre).to.equal(data.genre);
    expect(ISBN).to.equal(data.ISBN);
  });

  it('works with null', () =>{
    const data = {
      title: null,
      author: null,
      genre: null,
      ISBN: null
    };

    const {title, author, genre, ISBN} = bookFactory(data);

    expect(title).to.equal(data.title);
    expect(author).to.equal(data.author);
    expect(genre).to.equal(data.genre);
    expect(ISBN).to.equal(data.ISBN);
  });
});