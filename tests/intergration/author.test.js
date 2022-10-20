const { expect } = require('chai');
const { Author } = require('../../src/models');
const { authorFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('/authors', () => {
  before(async () => Author.sequelize.sync());

  beforeEach(async () => {
    await Author.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the databse', async () => {
        const data = authorFactory();

        const response = await appPost('/authors', data);
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal(data.author);
        expect(newAuthorRecord.author).to.equal(data.author)
      });

      describe('author', () => {
        it('must contain an author', async () => {
          const data = undefined;

          const response = await appPost('/authors', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Must provide an author');
        });

        it('author cannot be empty', async () => {
          const data = {
            author: ''
          };

          const response = await appPost('/authors', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('The author cannot be empty');
        });

        it('author must be unique', async () => {
          const data = {
            author: 'Author'
          };

          await appPost('/authors', data);
          const response = await appPost('/authors', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('The author must be unique');
        });
      });
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
      authors = await Promise.all([
        Author.create(authorFactory()),
        Author.create(authorFactory()),
        Author.create(authorFactory()),
      ]);
    });

    describe('GET /authors', () => {
      it('gets all author records', async () => {
        const response = await appGet('/authors');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe('GET /authors/:id', () => {
      it('gets author record by id', async () => {
        const author = authors[0];
        const response = await appGet(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await appGet('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates author by id', async () => {
        const author = authors[0];

        const data = { author: 'Arthur' };

        const response = await appPatch(`/authors/${author.id}`, data);
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal(data.author);
      });

      it('returns a 404 if the author does not exist', async () => {
        const data = { author: 'Arthur' };

        const response = await appPatch('/authors/12345', data);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });      
    });

    describe('DELETE /authors/:id', () => {
      it('deletes author record by id', async () => {
        const author = authors[0];
        const response = await appDelete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await appDelete('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The author could not be found.');
      });
    });
  });
});