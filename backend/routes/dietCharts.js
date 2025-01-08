const express = require('express');
const router = express.Router();
const {
    createDietChart,
    getDietCharts,
    getDietChartById,
    updateDietChart,
    updateMealStatus
} = require('../controllers/dietChartController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .post(protect, admin, createDietChart)
    .get(protect, getDietCharts);

router.route('/:id')
    .get(protect, getDietChartById)
    .put(protect, admin, updateDietChart);

router.route('/:id/meals/:mealId')
    .put(protect, updateMealStatus);

module.exports = router; 