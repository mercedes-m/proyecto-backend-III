import swaggerJsdoc from 'swagger-jsdoc';

const port = process.env.PORT || 8080;
const serverUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AdoptMe API - Backend III',
    version: '1.0.0',
    description:
      'Documentación de la API para el proyecto Backend III (Users, Pets, Adoptions, Mocks).',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Servidor local',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f0c0f4ab12cd34ef567890' },
          first_name: { type: 'string', example: 'María' },
          last_name: { type: 'string', example: 'Muñoz' },
          email: { type: 'string', example: 'maria@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          pets: {
            type: 'array',
            items: { type: 'string' },
            example: [],
          },
        },
      },
      NewUser: {
        type: 'object',
        required: ['first_name', 'last_name', 'email', 'password'],
        properties: {
          first_name: { type: 'string', example: 'María' },
          last_name: { type: 'string', example: 'Muñoz' },
          email: { type: 'string', example: 'maria@example.com' },
          password: { type: 'string', example: 'coder123' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      ApiResponseUsers: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          payload: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
        },
      },
      ApiResponseUser: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          payload: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./src/routes/*.js'], 
});