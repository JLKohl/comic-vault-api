const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ID validator (used for GET by ID, UPDATE, DELETE)
const idValidator = [
  param('id').isMongoId().withMessage('Invalid issue ID'),
  validate,
];

// Create a new issue
const createValidation = [
  body('title')
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title is required'),
  body('issueNumber')
    .isInt({ min: 1 }).withMessage('Issue number must be a positive number')
    .notEmpty().withMessage('Issue number is required'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  body('releaseDate')
    .optional()
    .isISO8601().withMessage('Release date must be a valid date (YYYY-MM-DD)'),
  validate,
];

// Update an existing issue
const updateValidation = [
  param('id').isMongoId().withMessage('Invalid issue ID'),
  body('title')
    .optional()
    .isString().withMessage('Title must be a string'),
  body('issueNumber')
    .optional()
    .isInt({ min: 1 }).withMessage('Issue number must be a positive number'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  body('releaseDate')
    .optional()
    .isISO8601().withMessage('Release date must be a valid date (YYYY-MM-DD)'),
  validate,
];

// Export
module.exports = {
  validators: {
    getById: idValidator,
    create: createValidation,
    update: updateValidation,
    delete: idValidator,
  },
};