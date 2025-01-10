const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getDeliveryTasks,
    updateDeliveryStatus
} = require('../controllers/deliveryController');

// Protected routes
router.use(protect);

router.get('/tasks', getDeliveryTasks);
router.put('/tasks/:taskId/status', updateDeliveryStatus); // Updated route parameter to match controller

module.exports = router; 