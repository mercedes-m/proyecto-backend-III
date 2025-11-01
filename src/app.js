import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();
const PORT = process.env.PORT || 8080;

// (Opcional) silenciar warning de strictQuery en Mongoose 7
// mongoose.set('strictQuery', true);

// Conexión a MongoDB (usa MONGO_URL de .env o .env.test)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar con MongoDB:', err.message));

app.use(express.json());
app.use(cookieParser());

// Healthcheck
app.get('/health', (_req, res) => res.status(200).send('OK'));

// Routers
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exportar la app para poder testear con supertest
export default app;

// Levantar servidor SOLO si no estamos en test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
}