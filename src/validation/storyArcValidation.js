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
  param('id').isMongoId().withMessage('Invalid story arc ID'),
  validate,
];

// Create a new story arc
const createValidation = [
  body('title')
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title is required'),
  body('description')
    .isString().withMessage('Description must be a string')
    .notEmpty().withMessage('Description is required'),
  body('mainCharacters')
    .optional()
    .isArray().withMessage('mainCharacters must be an array of strings')
    .custom(arr => arr.every(i => typeof i === 'string')).withMessage('All mainCharacters must be strings'),
  body('startIssue')
    .optional()
    .isInt({ min: 1 }).withMessage('startIssue must be a positive number'),
  body('endIssue')
    .optional()
    .isInt({ min: 1 }).withMessage('endIssue must be a positive number'),
  body('status')
    .optional()
    .isIn(['Planned', 'Ongoing', 'Completed']).withMessage('Status must be Planned, Ongoing, or Completed'),
  validate,
];

// Update an existing story arc
const updateValidation = [
  param('id').isMongoId().withMessage('Invalid story arc ID'),
  body('title')
    .optional()
    .isString().withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  body('mainCharacters')
    .optional()
    .isArray().withMessage('mainCharacters must be an array of strings')
    .custom(arr => arr.every(i => typeof i === 'string')).withMessage('All mainCharacters must be strings'),
  body('startIssue')
    .optional()
    .isInt({ min: 1 }).withMessage('startIssue must be a positive number'),
  body('endIssue')
    .optional()
    .isInt({ min: 1 }).withMessage('endIssue must be a positive number'),
  body('status')
    .optional()
    .isIn(['Planned', 'Ongoing', 'Completed']).withMessage('Status must be Planned, Ongoing, or Completed'),
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