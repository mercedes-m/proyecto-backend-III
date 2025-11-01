import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "665fa1e2b8d2a0a1c2d3e4f5"
 *                       first_name:
 *                         type: string
 *                         example: "Ana"
 *                       last_name:
 *                         type: string
 *                         example: "García"
 *                       email:
 *                         type: string
 *                         example: "ana@example.com"
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario (simple)
 *     description: Crea un usuario básico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name: { type: string, example: "Ada" }
 *               last_name:  { type: string, example: "Lovelace" }
 *               email:      { type: string, format: email, example: "ada@example.com" }
 *               password:   { type: string, example: "coder123" }
 *               role:       { type: string, enum: [user, admin], example: "user" }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 payload:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "665fa1e2b8d2a0a1c2d3e4f5" }
 *                     first_name: { type: string, example: "Ada" }
 *                     last_name: { type: string, example: "Lovelace" }
 *                     email: { type: string, example: "ada@example.com" }
 *                     role: { type: string, example: "user" }
 *       400:
 *         description: Datos inválidos
 *       501:
 *         description: No implementado en este controlador
 */
router.post('/', async (req, res, next) => {
  if (typeof usersController.createUser === 'function') {
    return usersController.createUser(req, res, next);
  }
  return res
    .status(501)
    .json({ status: 'error', error: 'POST /api/users no implementado en este proyecto.' });
});

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema: { type: string }
 *         description: ID del usuario (Mongo ObjectId)
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "success" }
 *                 payload:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "665fa1e2b8d2a0a1c2d3e4f5" }
 *                     first_name: { type: string, example: "Ana" }
 *                     last_name: { type: string, example: "García" }
 *                     email: { type: string, example: "ana@example.com" }
 *       400:
 *         description: ID inválido
 *       404:
 *         description: No encontrado
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No encontrado
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:uid', usersController.deleteUser);

export default router;