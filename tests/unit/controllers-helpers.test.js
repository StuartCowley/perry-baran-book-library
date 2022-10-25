const sinon = require('sinon');
const rewire = require('rewire');
const helpers = rewire('../../src/controllers/helpers');

describe('controller helpers', () => {
  const data = {};
  const id = 0;
  const model = 'model';
  const Model = {
    create: () => {},
    findAll: () => {},
    findByPk: () => {},
    update: () => {},
    destroy: () => {}
  };
  const res = {
    status: () => {}
  };
  const status = {
    json: () => {},
    send: () => {}
  };
  const response = {
    dataValues: {}
  };
  const err = {
    errors: [{ message: 'test' }]
  };
  
  let modelStub;
  let statusStub;
  let jsonStub;

  beforeEach(() => {
    modelStub = sinon.stub().returns(Model);
    helpers.__set__({
      getModel: modelStub
    });
    statusStub = sinon.stub(res, 'status').returns(status);
    jsonStub = sinon.stub(status, 'json');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    let createStub;

    beforeEach(() => {
      createStub = sinon.stub(Model, 'create');
    });

    it('returns 201', async () => {
      try {
        createStub.returns(response);

        await helpers.create(data, res, model);
        
        sinon.assert.calledOnce(modelStub);
        sinon.assert.calledWith(modelStub, model);
        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWith(createStub, data);
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 201);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, response);        
      } catch(err) {
        throw new Error(err);
      }
    });

    it('returns 500', async () => {
      try {
        createStub.throws(err);

        await helpers.create(data, res, model);

        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 500);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});        
      } catch(err) {
        throw new Error(err);
      }
    });
  });

  describe('read', () => {
    const options = {};
    let optionsStub;

    beforeEach(() => {
      optionsStub = sinon.stub().returns(options);
      helpers.__set__({
        getOptions: optionsStub
      });
    });

    describe('readAll', () => {
      let findAllStub;

      beforeEach(() => {
        findAllStub = sinon.stub(Model, 'findAll');
      });
      
      it('returns 200', async () => {
        try {
          findAllStub.returns(response);

          await helpers.readAll(res, model);

          sinon.assert.calledOnce(modelStub);
          sinon.assert.calledWith(modelStub, model);
          sinon.assert.calledOnce(optionsStub);
          sinon.assert.calledWith(optionsStub, model);        
          sinon.assert.calledOnce(findAllStub);
          sinon.assert.calledWith(findAllStub, options);
          sinon.assert.calledOnce(statusStub);
          sinon.assert.calledWith(statusStub, 200);
          sinon.assert.calledOnce(jsonStub);
          sinon.assert.calledWith(jsonStub, response);        
        } catch(err) {
          throw new Error(err);
        }
      });

      it('returns 500', async () => {
        try {
          findAllStub.throws(err);

          await helpers.readAll(res, model);

          sinon.assert.calledOnce(statusStub);
          sinon.assert.calledWith(statusStub, 500);
          sinon.assert.calledOnce(jsonStub);
          sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});        
        } catch(err) {
          throw new Error(err);
        }
      });
    });

    describe('readById', () => {
      let findByPk;

      beforeEach(() => {
        findByPk = sinon.stub(Model, 'findByPk');
      });
      
      it('returns 200', async () => {
        try {
          findByPk.returns(response);

          await helpers.readById(id, res, model);

          sinon.assert.calledOnce(modelStub);
          sinon.assert.calledWith(modelStub, model);
          sinon.assert.calledOnce(optionsStub);
          sinon.assert.calledWith(optionsStub, model);
          sinon.assert.calledOnce(findByPk);
          sinon.assert.calledWith(findByPk, id, options);
          sinon.assert.calledOnce(statusStub);
          sinon.assert.calledWith(statusStub, 200);
          sinon.assert.calledOnce(jsonStub);
          sinon.assert.calledWith(jsonStub, response);        
        } catch(err) {
          throw new Error(err);
        }
      });

      it('returns 404', async () => {
        try {
          findByPk.returns(undefined);

          await helpers.readById(id, res, model);

          sinon.assert.calledOnce(statusStub);
          sinon.assert.calledWith(statusStub, 404);
          sinon.assert.calledOnce(jsonStub);
          sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });        
        } catch(err) {
          throw new Error(err);
        }
      });

      it('returns 500', async () => {
        try {
          findByPk.throws(err);

          await helpers.readById(id, res, model);

          sinon.assert.calledOnce(statusStub);
          sinon.assert.calledWith(statusStub, 500);
          sinon.assert.calledOnce(jsonStub);
          sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});        
        } catch(err) {
          throw new Error(err);
        }
      });
    });
  });

  describe('update', () => {
    let updateStub;

    beforeEach(() => {
      updateStub = sinon.stub(Model, 'update');
    });

    it('returns 200', async () => {
      try {
        const sendStub = sinon.stub(status, 'send');
        updateStub.returns([response]);

        await helpers.update(data, id, res, model);
        
        sinon.assert.calledOnce(modelStub);
        sinon.assert.calledWith(modelStub, model);
        sinon.assert.calledOnce(updateStub);
        sinon.assert.calledWith(updateStub, data, { where: { id } });
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 200);
        sinon.assert.calledOnce(sendStub);        
      } catch(err) {
        throw new Error(err);
      }
    });

    it('returns 404', async () => {
      try {
        updateStub.returns([undefined]);

        await helpers.update(data, id, res, model);
        
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 404);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });        
      } catch(err) {
        throw new Error(err);
      }
    });

    it('returns 500', async () => {
      try {
        updateStub.throws(err);

        await helpers.update(data, id, res, model);
        
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 500);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});        
      } catch(err) {
        throw new Error(err);
      }
    });
  });

  describe('delete', () => {
    let destroyStub;

    beforeEach(() => {
      destroyStub = sinon.stub(Model, 'destroy');
    });

    it('returns 204', async () => {
      try {
        const sendStub = sinon.stub(status, 'send');
        destroyStub.returns(true);

        await helpers.delete(id, res, model);
        
        sinon.assert.calledOnce(modelStub);
        sinon.assert.calledWith(modelStub, model);
        sinon.assert.calledOnce(destroyStub);
        sinon.assert.calledWith(destroyStub, { where: { id } });
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 204);
        sinon.assert.calledOnce(sendStub);        
      } catch(err) {
        throw new Error(err);
      }
    });

    it('returns 404', async () => {
      try {
        destroyStub.returns(undefined);

        await helpers.delete(id, res, model);
        
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 404);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, { error: `The ${model} could not be found.` });        
      } catch(err) {
        throw new Error(err);
      }
    });

    it('returns 500', async () => {
      try {
        destroyStub.throws(err);

        await helpers.delete(id, res, model);
        
        sinon.assert.calledOnce(statusStub);
        sinon.assert.calledWith(statusStub, 500);
        sinon.assert.calledOnce(jsonStub);
        sinon.assert.calledWith(jsonStub, {error: err.errors.map(e => e.message)});        
      } catch(err) {
        throw new Error(err);
      }
    });
  });
});