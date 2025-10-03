import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'; 

const app = express();
const PORT = process.env.PORT || 8080;

// conexión a Mongo con log de estado
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

app.use(express.json());
app.use(cookieParser());

// routers
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter); 

// healthcheck opcional
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
