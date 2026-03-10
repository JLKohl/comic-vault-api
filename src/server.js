require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { MongoClient } = require('mongodb');

let swaggerSpec;
try {
  swaggerSpec = require('../swagger-output.json');
} catch (error) {
  console.warn('Swagger docs not generated yet. Run "npm run swagger" to create swagger-output.json.');
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Comic Vault API',
      version: '1.0.0',
      description: 'Swagger docs not generated yet. Run "npm run swagger".',
    },
  };
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/', (req, res) => {
  res.send('Welcome to The Comic Vault API');
});

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to connect to database', error);
  }
}

startServer();