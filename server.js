// ======================
// ENV CONFIG
// ======================
require('dotenv').config();

console.log("ENV CHECK:", process.env.MONGO_URI);
console.log("CWD:", process.cwd());
console.log("ENV FILE EXISTS:", require('fs').existsSync('./.env'));
console.log("MONGO_URI:", process.env.MONGO_URI);


// ======================
// IMPORTS
// ======================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

// Routes
const characterRoutes = require('./src/routes/characterRoutes');

// ======================
// ENV VALIDATION
// ======================
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// ======================
// APP SETUP
// ======================
const app = express();
const port = process.env.PORT || 3000;

// ======================
// SWAGGER SETUP
// ======================
let swaggerSpec;

try {
  swaggerSpec = require('./swagger-output.json');
} catch (error) {
  console.warn('Swagger docs not generated yet. Run "npm run swagger".');
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Comic Vault API',
      version: '1.0.0',
      description: 'Swagger docs not generated yet.',
    },
  };
}

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// ROUTES
// ======================
app.use('/api/characters', characterRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Welcome to The Comic Vault API');
});

// ======================
// DATABASE + SERVER START
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });