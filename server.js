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
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport'); 

require('./src/middleware/passport');

// Routes
const homeRoute = require('./src/routes/home');
const characterRoutes = require('./src/routes/characterRoutes');

const authRoutes = require('./src/routes/authRoutes');
const characterRoutes = require('./src/routes/characterRoutes');
const { ensureAuthenticated } = require('./src/middleware/authMiddleware');

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

// view engine
app.set('view engine', 'ejs');

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'supersecretkey', 
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash('error');
  next();
});

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// ROUTES
// ======================
app.use('/', homeRoute);
app.use('/api/characters', characterRoutes);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash('error');
  next();
});

app.set('view engine', 'ejs');

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
 */

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});
app.use('/auth', authRoutes);
app.use('/api/characters', characterRoutes);

app.use(
  '/api-docs',
  ensureAuthenticated,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ======================
// DATABASE + SERVER START
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
  });
