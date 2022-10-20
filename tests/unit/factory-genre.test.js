const { expect } = require('chai');
const { genreFactory } = require('../helpers/dataFactory');

describe('genreFactory', () => {
  it('generates random data', () => {
    const { genre } = genreFactory();

    expect(typeof genre).to.equal('string');
  });

  it('returns passed data', () =>{
    const data = 'Genre';

    const { genre } = genreFactory(data);

    expect(genre).to.equal(data);
  });
});