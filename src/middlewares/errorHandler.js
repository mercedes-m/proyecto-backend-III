import logger from '../utils/logger.js';

// Campos sensibles a ocultar si aparecen en el body
const SENSITIVE_FIELDS = ['password', 'pass', 'token', 'authorization'];

function sanitizeBody(body) {
  try {
    if (!body || typeof body !== 'object') return body;
    const clone = { ...body };
    for (const key of Object.keys(clone)) {
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        clone[key] = '[REDACTED]';
      }
    }
    return clone;
  } catch {
    return undefined;
  }
}

function resolveStatus(err) {
  // Prioridades comunes
  let status =
    err.statusCode ||
    err.status ||
    (typeof err.code === 'number' ? err.code : undefined);

  // Mongoose / Mongo 
  if (!status) {
    if (err.name === 'CastError') status = 400; // ObjectId inválido
    if (err.name === 'ValidationError') status = 400;
    if (err.code === 11000) status = 409; // duplicado
  }

  // JWT/credenciales
  if (!status && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    status = 401;
  }

  return Number.isInteger(status) ? status : 500;
}

export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = resolveStatus(err);

  // Log seguro (si no hay logger, cae a console)
  const safeLog = sanitizeBody(req.body);
  const logPayload = {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: safeLog,
    status,
    error: err?.message,
  };
  try {
    if (logger?.error) logger.error('Unhandled error', logPayload);
    else console.error('[ERROR]', logPayload, err?.stack);
  } catch {
    console.error('[ERROR]', err?.message || err);
  }

  const payload = {
    status: 'error',
    message: err.publicMessage || err.clientMessage || (status === 500 ? 'Internal Server Error' : err.message || 'Request error'),
  };

  // Info extra solo fuera de producción
  if (process.env.NODE_ENV !== 'production') {
    payload.details = err.message;
    if (err?.stack) payload.stack = err.stack;
  }

  return res.status(status).json(payload);
}