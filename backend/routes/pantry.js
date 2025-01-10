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

// Protected routes
router.use(protect);

// Pantry Management Routes (Manager Access)
router.route('/')
    .get(authorize(['manager', 'admin']), getPantries)
    .post(authorize(['manager', 'admin']), createPantry);

router.route('/:id')
    .get(authorize(['manager', 'admin']), getPantryById)
    .put(authorize(['manager', 'admin']), updatePantry);

// Task Routes (Pantry Staff Access)
router.get('/my-tasks', authorize(['pantry']), getMyTasks);
router.get('/tasks', authorize(['manager', 'pantry']), getPantryTasks);
router.put('/tasks/:taskId/status', authorize(['pantry']), updateTaskStatus);
router.put('/tasks/:taskId/assign-delivery', authorize(['pantry']), assignDeliveryPerson);
router.put('/tasks/:taskId/quality-check', authorize(['pantry']), performQualityCheck);

// Separate routes for pantry staff tasks
router.get('/staff/tasks', protect, authorize(['pantry']), getMyTasks);
router.put('/staff/tasks/:taskId/status', protect, authorize(['pantry']), updateTaskStatus);

// Update the error handling middleware
router.use((err, req, res, next) => {
    console.error('Pantry Route Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error in pantry route',
        error: err.message
    });
});

module.exports = router; 