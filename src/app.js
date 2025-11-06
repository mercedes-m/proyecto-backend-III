import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import 'dotenv/config';

// Routers
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

// Logger & Error Handler
import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB (usa MONGO_URL de .env o .env.test)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => (logger?.info ? logger.info('Conectado a MongoDB') : console.log('Conectado a MongoDB')))
  .catch((err) =>
    (logger?.error
      ? logger.error('Error al conectar con MongoDB', { error: err.message })
      : console.error('Error al conectar con MongoDB:', err.message))
  );

// Middlewares base
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Log básico de cada request
app.use((req, _res, next) => {
  if (logger?.info) logger.info(`${req.method} ${req.originalUrl}`);
  else console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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

// 404 para rutas no encontradas (pasa al errorHandler)
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(errorHandler);

// Exportar la app para poder testear con supertest
export default app;

// Levantar servidor SOLO si no estamos en test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    if (logger?.info) logger.info(`Servidor escuchando en el puerto ${PORT}`);
    else console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}