try {
  require('dotenv').config();
} catch {
  // Render provides env vars directly; this keeps production startup resilient.
}

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

//check to make sure .env file is set up correctly in project
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let swaggerSpec;
try {
  swaggerSpec = require('./swagger-output.json');
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

// MongoDB connection with mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  })
  .catch(err => console.error(err));
