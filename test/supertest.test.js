import 'dotenv/config';              // carga .env / .env.test cuando NODE_ENV=test
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

describe('Healthcheck', function () {
  it('GET /health debe responder 200 OK', async function () {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.text).to.match(/OK/i);
  });
});

// Cerrar la conexión a Mongo al terminar los tests (evita que Mocha quede colgado)
after(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (e) {
    // no-op
  }
});