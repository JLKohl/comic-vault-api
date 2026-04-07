const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const port = process.env.PORT || 3000;
const appBaseUrl = (
  process.env.PUBLIC_BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${port}`
).replace(/\/$/, '');

const doc = {
  info: {
    title: 'Comic Vault API',
    description:
      'RESTful API for managing comic characters, issues, story arcs, and worlds.',
    version: '1.0.0',
  },
  servers: [
    {
      url: appBaseUrl,
      description: 'Current deployment server',
    },
    {
      url: `http://localhost:${port}`,
      description: 'Local development server',
    },
  ],

  basePath: '/',

  tags: [
    { name: 'Character', description: 'Routes for managing comic characters' },
    { name: 'Story Arc', description: 'Routes for managing story arcs' },
    { name: 'Issue', description: 'Routes for managing Issues' },
    { name: 'Place', description: 'Routes for managing Places'}
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './src/routes/characterRoutes.js',
  './src/routes/storyArcRoutes.js',
  './src/routes/issueRoutes.js',
  './src/routes/placesRoutes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
