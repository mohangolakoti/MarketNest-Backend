const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/productService');

const getBrandDashboard = asyncHandler(async (req, res) => {
  const summary = await productService.getBrandDashboardSummary(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Dashboard summary fetched successfully',
    data: summary,
  });
});

module.exports = {
  getBrandDashboard,
};