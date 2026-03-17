const express = require('express');

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware('brand'), dashboardController.getBrandDashboard);

module.exports = router;