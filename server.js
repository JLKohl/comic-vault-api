
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

require('./src/middleware/passport');

const authRoutes = require('./src/routes/authRoutes');
const characterRoutes = require('./src/routes/characterRoutes');
const { ensureAuthenticated } = require('./src/middleware/authMiddleware');

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let swaggerSpec;
try {
  swaggerSpec = require('./swagger-output.json');
} catch (error) {
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Comic Vault API',
      version: '1.0.0',
      description: 'Swagger docs not generated yet.',
    },
  };
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'someSecretString',
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.error(err));

