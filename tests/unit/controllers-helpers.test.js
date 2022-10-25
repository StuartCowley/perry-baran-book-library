const sinon = require('sinon');
const rewire = require('rewire');
const helpers = rewire('../../src/controllers/helpers');

describe('controller helpers', () => {
  const data = {};
  const model = 'model';
  const status = {
    json: () => {},
    send: () => {}
  };
  const res = {
    status: () => {}
  };
  const response = {
    dataValues: {}
  };
  const err = {
    errors: [{ message: 'test' }]
  };
  const id = 0;

  let statusStub;
  let jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub(res, 'status').returns(status);
    jsonStub = sinon.stub(status, 'json');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    const Model = {
        create: () => {}
    };

    let createStub;

    beforeEach(() => {
      helpers.__set__({
        getModel: sinon.stub().returns(Model)
      });
      
      createStub = sinon.stub(Model, 'create')
    });

    it('returns 201', async () => {
      createStub.returns(response);

      await helpers.create(data, res, model);
      
      sinon.assert.calledOnce(createStub);
      sinon.assert.calledWith(createStub, data);
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 201);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, response);
    });

    it('returns 500', async () => {
      createStub.throws(err);

      await helpers.create(data, res, model);

      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});
    });
  });

  describe('read', () => {
    describe('readAll', () => {
      const Model = {
          findAll: () => {}
      };
      const options = {};

      let findAllStub;

      beforeEach(() => {
        helpers.__set__({
          getModel: sinon.stub().returns(Model),
          getOptions: sinon.stub().returns(options)
        });
        
        findAllStub = sinon.stub(Model, 'findAll');
      });
      
      it('returns 200', async () => {
        findAllStub.returns(response);

        await helpers.readAll(res, model);

        sinon.assert.calledOnce(findAllStub);
        sinon.assert.calledWith(findAllStub, options);
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 200);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, response);
      });

      it('returns 500', async () => {
        findAllStub.throws(err);

        await helpers.readAll(res, model);

        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 500);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});
      });
    });

    describe('readById', () => {
      const Model = {
        findByPk: () => {}
      };
      const options = {};

      let findByPk;

      beforeEach(() => {
        helpers.__set__({
          getModel: sinon.stub().returns(Model),
          getOptions: sinon.stub().returns(options)
        });
        
        findByPk = sinon.stub(Model, 'findByPk');
      });
      
      it('returns 200', async () => {
        findByPk.returns(response);

        await helpers.readById(id, res, model);

        sinon.assert.calledOnce(findByPk);
        sinon.assert.calledWith(findByPk, id, options);
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 200);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, response);
      });

      it('returns 404', async () => {
        findByPk.returns(undefined);

        await helpers.readById(id, res, model);

        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 404);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });
      });

      it('returns 500', async () => {
        findByPk.throws(err);

        await helpers.readById(id, res, model);

        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 500);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});
      });
    });
  });

  describe('update', () => {
    const Model = {
      update: () => {}
    };

    let updateStub;

    beforeEach(() => {
      helpers.__set__({
        getModel: sinon.stub().returns(Model)
      });
      
      updateStub = sinon.stub(Model, 'update')
    });

    it('returns 200', async () => {
      const sendStub = sinon.stub(status, 'send');
      updateStub.returns([response]);

      await helpers.update(data, id, res, model);
      
      sinon.assert.calledOnce(updateStub);
      sinon.assert.calledWith(updateStub, data, { where: { id } });
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 200);
      sinon.assert.calledOnce(sendStub);
    });

    it('returns 404', async () => {
      updateStub.returns([undefined]);

      await helpers.update(data, id, res, model);
      
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });
    });

    it('returns 500', async () => {
      updateStub.throws(err);

      await helpers.update(data, id, res, model);
      
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});
    });
  });

  describe('delete', () => {
    const Model = {
      destroy: () => {}
    };

    let destroyStub;

    beforeEach(() => {
      helpers.__set__({
        getModel: sinon.stub().returns(Model)
      });
      
      destroyStub = sinon.stub(Model, 'destroy')
    });

    it('returns 204', async () => {
      const sendStub = sinon.stub(status, 'send');
      destroyStub.returns(true);

      await helpers.delete(id, res, model);
      
      sinon.assert.calledOnce(destroyStub);
      sinon.assert.calledWith(destroyStub, { where: { id } });
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 204);
      sinon.assert.calledOnce(sendStub);
    });

    it('returns 404', async () => {
      destroyStub.returns(undefined);

      await helpers.delete(id, res, model);
      
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 404);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });
    });

    it('returns 500', async () => {
      destroyStub.throws(err);

      await helpers.delete(id, res, model);
      
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledWith(statusStub, 500);
      sinon.assert.calledOnce(jsonStub);
      sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});
    });
  });
});