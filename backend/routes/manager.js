const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getReports, getPantryStaff, deleteStaff } = require('../controllers/managerController');

router.get('/dashboard-stats', protect, authorize('manager'), getDashboardStats);
router.get('/reports', protect, authorize('manager'), getReports);
router.get('/pantry-staff', protect, authorize('manager'), getPantryStaff);
router.delete('/pantry-staff/:id', protect, authorize('manager'), deleteStaff);

module.exports = router; 