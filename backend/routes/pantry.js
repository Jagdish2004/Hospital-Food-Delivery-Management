const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getPantryTasks,
    updateTaskStatus,
    assignDeliveryPersonnel,
    getDeliveryStaff
} = require('../controllers/pantryController');

// All routes are protected and require pantry or admin role
router.use(protect);
router.use(authorize('admin', 'pantry'));

router.route('/tasks')
    .get(getPantryTasks);

router.route('/tasks/:id/status')
    .put(updateTaskStatus);

router.route('/tasks/:id/assign')
    .put(assignDeliveryPersonnel);

router.route('/delivery-staff')
    .get(getDeliveryStaff);

module.exports = router; 