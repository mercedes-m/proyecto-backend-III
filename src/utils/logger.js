import winston from 'winston';

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const logger = winston.createLogger({
  level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // incluye stack trace en errors
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        // salida “linda” en desarrollo
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return stack
            ? `[${timestamp}] ${level}: ${message}\n${stack}${rest}`
            : `[${timestamp}] ${level}: ${message}${rest}`;
        })
      )
    }),
    // Archivo de errores en producción (opcional)
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : [])
  ]
});

export default logger;