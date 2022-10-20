const { expect } = require('chai');
const { authorFactory } = require('../helpers/dataFactory');

describe('authorFactory', () => {
  it('generates random data', () => {
    const { author } = authorFactory();

    expect(typeof author).to.equal('string');
  });

  it('returns passed data', () =>{
    const data = 'Author';

    const { author } = authorFactory(data);

    expect(author).to.equal(data);
  });
});