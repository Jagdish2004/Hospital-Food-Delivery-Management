const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getDeliveryTasks,
    updateDeliveryStatus
} = require('../controllers/deliveryController');

router.route('/tasks')
    .get(protect, getDeliveryTasks);

router.route('/tasks/:id/status')
    .put(protect, updateDeliveryStatus);

module.exports = router; 