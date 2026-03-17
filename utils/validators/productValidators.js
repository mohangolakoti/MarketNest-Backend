const { body, param, query } = require('express-validator');

const statusValidator = body('status')
  .optional()
  .isIn(['draft', 'published'])
  .withMessage('Status must be either draft or published');

const createProductValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid positive number')
    .toFloat(),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 80 })
    .withMessage('Category must be at most 80 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
];

const updateProductValidator = [
  param('id').isMongoId().withMessage('A valid product id is required'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Description must be at most 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a valid positive number')
    .toFloat(),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ max: 80 })
    .withMessage('Category must be at most 80 characters'),
  statusValidator,
];

const browseProductsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt(),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Search must be at most 150 characters'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Category must be at most 80 characters'),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  browseProductsValidator,
};