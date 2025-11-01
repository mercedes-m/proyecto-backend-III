import 'dotenv/config';
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

describe('Healthcheck', function () {
  // Asegura que en test tengamos MONGO_URL de pruebas
  before(function () {
    if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'test';
    if (!process.env.MONGO_URL) {
      process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/adoptme_test';
    }
  });

  it('GET /health debe responder 200 OK', async function () {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.text).to.match(/OK/i);
  });

  // Cerrar la conexión a Mongo al terminar (evita cuelgues de Mocha)
  after(async function () {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect(); // equivalente y seguro
      }
    } catch (_) {
      // no-op
    }
  });
});