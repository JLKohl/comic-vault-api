const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const port = process.env.PORT || 3000;

const doc = {
  info: {
    title: 'Comic Vault API',
    description:
      'RESTful API for managing comic characters, issues, story arcs, and worlds.',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server',
    },
    {
      url: 'https://comic-vault-api-f41d.onrender.com',
      description: 'Production server (Render)',
    },
  ],

  basePath: '/',

  tags: [
    { name: 'Characters', description: 'Routes for managing comic characters' },
    { name: 'Story Arc', description: 'Routes for managing story arcs' },
    { name: 'Issues', description: 'Routes for managing Issues' },
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './src/routes/characterRoutes.js',
  './src/routes/storyArcRoutes.js',
  './src/routes/issueRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
