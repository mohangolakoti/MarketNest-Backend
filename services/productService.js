const mongoose = require('mongoose');

const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const { uploadMultipleImages } = require('./cloudinaryUpload');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeProduct = (product) => ({
  id: product._id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  images: product.images,
  status: product.status,
  brand: product.brand,
  isDeleted: product.isDeleted,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const assertValidProductId = (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError('Invalid product id', 400);
  }
};

const createProduct = async (brandId, payload, files) => {
  if (!files || files.length === 0) {
    throw new AppError('At least one product image is required', 400);
  }

  const imageUrls = await uploadMultipleImages(files);

  const product = await Product.create({
    title: payload.title.trim(),
    description: payload.description.trim(),
    price: payload.price,
    category: payload.category.trim(),
    status: payload.status,
    images: imageUrls,
    brand: brandId,
  });

  await product.populate('brand', 'name email role');

  return sanitizeProduct(product);
};

const getOwnedProduct = async (productId, brandId) => {
  assertValidProductId(productId);

  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  if (product.brand.toString() !== brandId) {
    throw new AppError('You are not allowed to manage this product', 403);
  }

  return product;
};

const updateProduct = async (productId, brandId, payload, files) => {
  const product = await getOwnedProduct(productId, brandId);

  if (payload.title !== undefined) {
    product.title = payload.title.trim();
  }

  if (payload.description !== undefined) {
    product.description = payload.description.trim();
  }

  if (payload.price !== undefined) {
    product.price = payload.price;
  }

  if (payload.category !== undefined) {
    product.category = payload.category.trim();
  }

  if (payload.status !== undefined) {
    product.status = payload.status;
  }

  if (files && files.length > 0) {
    product.images = await uploadMultipleImages(files);
  }

  await product.save();
  await product.populate('brand', 'name email role');

  return sanitizeProduct(product);
};

const softDeleteProduct = async (productId, brandId) => {
  const product = await getOwnedProduct(productId, brandId);
  product.isDeleted = true;
  await product.save();

  return sanitizeProduct(product);
};

const browseProducts = async ({ page = 1, limit = 10, search, category }) => {
  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const currentLimit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : Math.min(parsedLimit, 50);
  const skip = (currentPage - 1) * currentLimit;

  const query = {
    status: 'published',
    isDeleted: false,
  };

  if (search) {
    query.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
  }

  if (category) {
    query.category = {
      $regex: `^${escapeRegex(category.trim())}$`,
      $options: 'i',
    };
  }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('brand', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit),
    Product.countDocuments(query),
  ]);

  return {
    products: products.map(sanitizeProduct),
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit) || 1,
    },
  };
};

const getPublishedProductDetails = async (productId) => {
  assertValidProductId(productId);

  const product = await Product.findOne({
    _id: productId,
    status: 'published',
    isDeleted: false,
  }).populate('brand', 'name');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return sanitizeProduct(product);
};

const getBrandDashboardSummary = async (brandId) => {
  const [totalProducts, publishedCount, archivedCount] = await Promise.all([
    Product.countDocuments({ brand: brandId }),
    Product.countDocuments({
      brand: brandId,
      status: 'published',
      isDeleted: false,
    }),
    Product.countDocuments({
      brand: brandId,
      $or: [{ status: 'draft' }, { isDeleted: true }],
    }),
  ]);

  return {
    totalProducts,
    publishedCount,
    archivedCount,
  };
};

module.exports = {
  createProduct,
  updateProduct,
  softDeleteProduct,
  browseProducts,
  getPublishedProductDetails,
  getBrandDashboardSummary,
};