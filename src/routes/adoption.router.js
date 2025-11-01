import { Router } from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import mongoose from 'mongoose';

const router = Router();

// Helpers de validación mínimos
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/adoptions -> lista
router.get('/', adoptionsController.getAllAdoptions);

// GET /api/adoptions/:aid -> detalle (400 si id inválido)
router.get('/:aid', (req, res, next) => {
  const { aid } = req.params;
  if (!isValidId(aid)) {
    return res.status(400).json({ status: 'error', error: 'Invalid adoption id' });
  }
  return adoptionsController.getAdoption(req, res, next);
});

// POST /api/adoptions/:uid/:pid -> crea adopción (contrato original)
router.post('/:uid/:pid', (req, res, next) => {
  const { uid, pid } = req.params;
  if (!isValidId(uid) || !isValidId(pid)) {
    return res.status(400).json({ status: 'error', error: 'Invalid user or pet id' });
  }
  return adoptionsController.createAdoption(req, res, next);
});

// NUEVO: POST /api/adoptions -> crea adopción con body { uid, pid } o { userId, petId }
// Esto es solo un “shim” para facilitar tests y Swagger sin romper la ruta original.
router.post('/', (req, res, next) => {
  const uid = req.body?.uid ?? req.body?.userId;
  const pid = req.body?.pid ?? req.body?.petId;

  if (!uid || !pid) {
    return res.status(400).json({
      status: 'error',
      error: 'Missing uid/pid (or userId/petId) in body'
    });
  }
  if (!isValidId(uid) || !isValidId(pid)) {
    return res.status(400).json({ status: 'error', error: 'Invalid user or pet id' });
  }

  // Normalizamos para reutilizar el controller existente
  req.params.uid = uid;
  req.params.pid = pid;
  return adoptionsController.createAdoption(req, res, next);
});

export default router;