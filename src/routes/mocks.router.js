import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mocking.js';

// Ajustár las rutas 
import userModel from '../dao/mongo/models/User.js';
import petModel from '../dao/mongo/models/Pet.js';

const router = Router();

/**
 * GET /api/mocks/mockingusers?count=50
 */
router.get('/mockingusers', async (req, res) => {
  try {
    const count = Number(req.query.count) || 50;
    const users = generateUsers(count);
    res.json({ status: 'success', payload: users, count: users.length });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

/**
 * GET /api/mocks/mockingpets?count=20
 */
router.get('/mockingpets', async (req, res) => {
  try {
    const count = Number(req.query.count) || 20;
    const pets = generatePets(count);
    res.json({ status: 'success', payload: pets, count: pets.length });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

/**
 * POST /api/mocks/generateData
 * Body: { "users": 50, "pets": 30 }
 * Genera e INSERTA en Mongo la cantidad indicada.
 */
router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body || {};

    const toInsertUsers = users > 0 ? generateUsers(Number(users)) : [];
    const toInsertPets = pets > 0 ? generatePets(Number(pets)) : [];

    const [usersResult, petsResult] = await Promise.all([
      toInsertUsers.length ? userModel.insertMany(toInsertUsers) : Promise.resolve([]),
      toInsertPets.length ? petModel.insertMany(toInsertPets) : Promise.resolve([]),
    ]);

    res.json({
      status: 'success',
      inserted: {
        users: usersResult.length,
        pets: petsResult.length,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;