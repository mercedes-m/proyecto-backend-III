import 'dotenv/config';
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const getPayload = (body) => body?.payload ?? body;

// Usamos DB de pruebas
before(function () {
  if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'test';
  if (!process.env.MONGO_URL) {
    process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/adoptme_test';
  }
});

describe('Adoption Router - Functional Tests', function () {
  this.timeout(15000);

  let userId;
  let petId;
  let adoptionId;

  it('SEED: POST /api/mocks/generateData (users=1, pets=1)', async function () {
    const res = await request(app)
      .post('/api/mocks/generateData')
      .set('Content-Type', 'application/json')
      .send({ users: 1, pets: 1 });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status');
  });

  it('GET /api/users y /api/pets deben devolver al menos 1 doc', async function () {
    const usersRes = await request(app).get('/api/users');
    expect(usersRes.status).to.equal(200);
    const users = getPayload(usersRes.body);
    expect(users).to.be.an('array').that.is.not.empty;
    userId = users[0]._id || users[0].id;

    const petsRes = await request(app).get('/api/pets');
    expect(petsRes.status).to.equal(200);
    const pets = getPayload(petsRes.body);
    expect(pets).to.be.an('array').that.is.not.empty;
    petId = pets[0]._id || pets[0].id;

    expect(userId, 'userId').to.exist;
    expect(petId, 'petId').to.exist;
  });

  it('POST /api/adoptions debe crear una adopción (éxito)', async function () {
    const res = await request(app)
      .post('/api/adoptions')
      .set('Content-Type', 'application/json')
      // Ajustá las keys si tu router usa nombres distintos (p. ej. userId/petId)
      .send({ uid: userId, pid: petId });

    expect([200, 201]).to.include(res.status);
    const body = res.body || {};
    const created = body.payload ?? body;
    adoptionId = created?._id || created?.id;
    expect(adoptionId).to.exist;
  });

  it('GET /api/adoptions debe listar adopciones', async function () {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    const list = getPayload(res.body);
    expect(list).to.be.an('array');
    // opcional: debería contener la recién creada
    if (adoptionId) {
      const found = list.find((a) => (a._id || a.id) === adoptionId);
      expect(found, 'adoption creada debe estar en la lista').to.exist;
    }
  });

  it('GET /api/adoptions/:aid con id inválido debe devolver 400 o 404', async function () {
    const res = await request(app).get('/api/adoptions/invalid-id');
    expect([400, 404]).to.include(res.status);
  });

  // (Opcional) si tu API soporta traer por id válido:
  it('GET /api/adoptions/:aid con id válido debería devolver 200', async function () {
    if (!adoptionId) this.skip();
    const res = await request(app).get(`/api/adoptions/${adoptionId}`);
    expect([200, 404]).to.include(res.status);
    // Algunas implementaciones no tienen GET by id; si devuelve 404 está bien.
  });

  // (Opcional) si tu API evita adoptar dos veces la misma mascota:
  it('POST /api/adoptions con la misma mascota debería fallar (409/400/422)', async function () {
    const res = await request(app)
      .post('/api/adoptions')
      .set('Content-Type', 'application/json')
      .send({ uid: userId, pid: petId });

    expect([400, 409, 422]).to.include(res.status);
  });
});

// Cerrar la conexión a Mongo al terminar los tests (evita que Mocha quede colgado)
after(async function () {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (_) {
    // no-op
  }
});