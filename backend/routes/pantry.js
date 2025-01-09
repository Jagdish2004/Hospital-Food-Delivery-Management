const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getPantryTasks,
    getMyTasks,
    createPantryTask,
    updateTaskStatus,
    assignDeliveryPerson,
    performQualityCheck,
    getPantries,
    getPantryById,
    createPantry,
    updatePantry
} = require('../controllers/pantryController');

// Allow both pantry staff and managers to access these routes
router.use(protect);
router.use(authorize('pantry', 'manager', 'admin'));

// Pantry management routes
router.route('/')
    .get(authorize('manager'), getPantries)
    .post(authorize('manager'), createPantry);

router.route('/:id')
    .get(authorize('manager'), getPantryById)
    .put(authorize('manager'), updatePantry);

// Task management routes
router.route('/tasks')
    .get(protect, authorize('pantry', 'manager'), getPantryTasks);

router.route('/my-tasks')
    .get(protect, authorize('pantry'), getMyTasks);

router.route('/tasks/:taskId/status')
    .put(protect, authorize('pantry'), updateTaskStatus);

router.route('/tasks/:taskId/assign-delivery')
    .put(authorize('pantry', 'manager'), assignDeliveryPerson);

router.route('/tasks/:taskId/quality-check')
    .put(authorize('pantry'), performQualityCheck);

module.exports = router; 