const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const port = process.env.PORT || 3000;

const doc = {
  info: {
    title: 'Comic Vault API',
    description: 'RESTful API for managing comic characters, issues, story arcs, and worlds.',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server',
    },
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
