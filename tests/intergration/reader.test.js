const { expect } = require('chai');
const { Reader } = require('../../src/models');
const { readerFactory } = require('../helpers/dataFactory');
const { appPost, appGet, appPatch, appDelete } = require('../helpers/requestHelpers');

describe('/readers', () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const data = readerFactory();
        const response = await appPost('/readers', data);
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(data.name);
        expect(newReaderRecord.name).to.equal(data.name);
        expect(newReaderRecord.email).to.equal(data.email);
        expect(newReaderRecord.password).to.equal(data.password);
      });

      describe('name', () => {
        it('must contain a name', async () => {
          const data = {
            email: 'future_ms_darcy@gmail.com',
            password: 'password'
          };

          const response = await appPost('/readers', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Reader.name cannot be null');
        });
      });
      
      describe('email', () => {
        it('must contain an email', async () => {
          const data = {
            name: 'Elizabeth Bennet',
            password: 'password'
          };

          const response = await appPost('/readers', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Reader.email cannot be null')
        });

        it('email must be valid format', async () => {
          const data = readerFactory({email: 'fake'})
          const response = await appPost('/readers', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Validation isEmail on email failed')
        });
      });

      describe('password', () => {
        it('must contain a password', async () => {
          const data = {
            name: 'Elizabeth Bennet',
            email: 'future_ms_darcy@gmail.com'
          };

          const response = await appPost('/readers', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Reader.password cannot be null')
        });

        it('password must atleast 8 characters long', async () => {
          const data = readerFactory({password: 'passwor'})
          const response = await appPost('/readers', data);

          expect(response.status).to.equal(500);
          expect(response.body.error[0]).to.equal('Validation len on password failed')
        });
      });
    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create(readerFactory()),
        Reader.create(readerFactory()),
        Reader.create(readerFactory()),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await appGet('/readers');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(readers.length);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(expected.password);
        });
      });
    });

    describe('GET /readers/:id', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        const response = await appGet(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(reader.password);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await appGet('/readers/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];

        const data = { email: 'miss_e_bennet@gmail.com' }

        const response = await appPatch(`/readers/${reader.id}`, data);
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal(data.email);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const data = { email: 'some_new_email@gmail.com' }

        const response = await appPatch('/readers/12345', data);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await appDelete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await appDelete('/readers/12345');
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });
  });
});
