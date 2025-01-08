const express = require('express');
const router = express.Router();
const {
    getPantryTasks,
    getMyTasks,
    updateTaskStatus,
    assignDeliveryPersonnel
} = require('../controllers/pantryTaskController');
const { protect, pantry } = require('../middleware/auth');

router.route('/')
    .get(protect, getPantryTasks);

router.route('/my-tasks')
    .get(protect, getMyTasks);

router.route('/:id/status')
    .put(protect, updateTaskStatus);

router.route('/:id/assign-delivery')
    .put(protect, pantry, assignDeliveryPersonnel);

module.exports = router; 