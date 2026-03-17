const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/productService');

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.user.id, req.body, req.files);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product,
    },
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.user.id,
    req.body,
    req.files
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product,
    },
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.softDeleteProduct(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

const browseProducts = asyncHandler(async (req, res) => {
  const result = await productService.browseProducts(req.query);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: result,
  });
});

const getProductDetails = asyncHandler(async (req, res) => {
  const product = await productService.getPublishedProductDetails(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product fetched successfully',
    data: {
      product,
    },
  });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  browseProducts,
  getProductDetails,
};