const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/managerController');

router.use(protect);
router.use(authorize('manager', 'admin'));

router.get('/dashboard-stats', getDashboardStats);

module.exports = router; 