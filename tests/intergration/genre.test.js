const { expect } = require('chai');
const { Genre } = require('../../src/models');
const { genreFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());

  beforeEach(async () => {
    await Genre.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /genres', async () => {
      it('creates a new genre in the database', async () => {
        const data = genreFactory();

        const response = await appPost('/genres', data);
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal(data.genre);
        expect(newGenreRecord.genre).to.equal(data.genre);        
      })

      describe('genre', () => {
        it('must contain a genre', async () => {
          const data = undefined;

          const response = await appPost('/genres', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Must provide a genre');
        });

        it('genre cannot be empty', async () => {
          const data = {
            genre: ''
          };

          const response = await appPost('/genres', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('The genre cannot be empty');
        });

        it('genre must be unique', async () => {
          const data = {
            genre: 'Genre'
          };

          await appPost('/genres', data);
          const response = await appPost('/genres', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('The genre must be unique');
        });
      });
    });
  });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      genres = await Promise.all([
        Genre.create(genreFactory()),
        Genre.create(genreFactory()),
        Genre.create(genreFactory()),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genre records', async () => {
        const response = await appGet('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genre record by id', async () => {
        const genre = genres[0];
        const response = await appGet(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await appGet('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre by id', async () => {
        const genre = genres[0];

        const data = { genre: 'Genre' };

        const response = await appPatch(`/genres/${genre.id}`, data);
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal(data.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const data = { genre: 'Genre' };

        const response = await appPatch('/genres/12345', data);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });      
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await appDelete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await appDelete('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});