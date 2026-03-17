const express = require('express');

const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createProductValidator,
  updateProductValidator,
  browseProductsValidator,
} = require('../utils/validators/productValidators');

const router = express.Router();

router.get('/', browseProductsValidator, validateRequest, productController.browseProducts);
router.get('/:id', productController.getProductDetails);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('brand'),
  upload.array('images', 6),
  createProductValidator,
  validateRequest,
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('brand'),
  upload.array('images', 6),
  updateProductValidator,
  validateRequest,
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('brand'),
  productController.deleteProduct
);

module.exports = router;