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
    param('id').isMongoId().withMessage('Invalid character ID'),
    validate,
  ];
  
  // Create a character arc
  const createValidation = [
    body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required'),
    body('alias')
        .optional()
        .isString().withMessage('Alias must be a string'),
    body('species')
        .optional()
        .isString().withMessage('Species must be a string'),
    body('alignment')
        .optional()
        .isString().withMessage('alignment must be a string'),
    body('abilities')
      .optional()
      .isArray().withMessage('abilities must be an array of strings')
      .custom(arr => arr.every(i => typeof i === 'string')).withMessage('All abilities must be strings'),
    body('firstAppearanceIssue')
      .optional()
      .isString().withMessage('firstAppearanceIssue must be a string'),
    body('homePlace')
      .optional()
      .isString().withMessage('homePlace must be a string'),
    body('status')
      .optional()
      .isIn(['Planned', 'Ongoing', 'Completed']).withMessage('Status must be Planned, Ongoing, or Completed'),
    validate,
  ];
  
  // Update an existing character
  const updateValidation = [
    param('id').isMongoId().withMessage('Invalid character ID'),
    body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required'),
    body('alias')
        .optional()
        .isString().withMessage('Alias must be a string'),
    body('species')
        .optional()
        .isString().withMessage('Species must be a string'),
    body('alignment')
        .optional()
        .isString().withMessage('alignment must be a string'),
    body('abilities')
        .optional()
        .isArray().withMessage('abilities must be an array of strings')
        .custom(arr => arr.every(i => typeof i === 'string')).withMessage('All abilities must be strings'),
    body('firstAppearanceIssue')
        .optional()
        .isString().withMessage('firstAppearanceIssue must be a string'),
    body('homePlace')
        .optional()
        .isString().withMessage('homePlace must be a string'),
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