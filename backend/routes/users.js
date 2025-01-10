const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDeliveryStaff } = require('../controllers/userController');

router.get('/delivery-staff', protect, authorize('manager', 'pantry'), getDeliveryStaff);

module.exports = router; 