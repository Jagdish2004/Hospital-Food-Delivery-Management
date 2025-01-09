const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDietCharts,
    getDietChartById,
    createDietChart,
    updateDietChart,
    deleteDietChart
} = require('../controllers/dietChartController');

// Protect all routes
router.use(protect);

router.route('/')
    .get(authorize('manager', 'admin', 'pantry'), getDietCharts)
    .post(authorize('manager', 'admin'), createDietChart);

router.route('/:id')
    .get(authorize('manager', 'admin', 'pantry'), getDietChartById)
    .put(authorize('manager', 'admin'), updateDietChart)
    .delete(authorize('admin'), deleteDietChart);

module.exports = router; 