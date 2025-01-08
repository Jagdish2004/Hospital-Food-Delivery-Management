const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient');
const PantryTask = require('../models/PantryTask');

// @desc    Create a new diet chart
// @route   POST /api/diet-charts
// @access  Private/Admin
const createDietChart = async (req, res) => {
    try {
        const {
            patientId,
            startDate,
            endDate,
            meals,
            restrictions
        } = req.body;

        // Verify patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const dietChart = await DietChart.create({
            patient: patientId,
            startDate,
            endDate,
            meals,
            restrictions,
            createdBy: req.user._id
        });

        // Create pantry tasks for each meal
        const pantryTasks = meals.map(meal => ({
            dietChart: dietChart._id,
            meal: meal._id,
            assignedTo: meal.assignedTo
        }));

        await PantryTask.insertMany(pantryTasks);

        // Update patient's current diet chart
        await Patient.findByIdAndUpdate(patientId, {
            currentDietChart: dietChart._id
        });

        res.status(201).json(dietChart);
    } catch (error) {
        console.error('Error creating diet chart:', error);
        res.status(400).json({ 
            message: error.message || 'Error creating diet chart',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Get all diet charts
// @route   GET /api/diet-charts
// @access  Private
const getDietCharts = async (req, res) => {
    try {
        const dietCharts = await DietChart.find({})
            .populate('patient', 'name roomNumber bedNumber')
            .populate('createdBy', 'name')
            .sort('-createdAt');

        res.json(dietCharts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get diet chart by ID
// @route   GET /api/diet-charts/:id
// @access  Private
const getDietChartById = async (req, res) => {
    try {
        const dietChart = await DietChart.findById(req.params.id)
            .populate('patient')
            .populate('createdBy', 'name')
            .populate('meals.assignedTo', 'name')
            .populate('meals.preparedBy', 'name')
            .populate('meals.deliveredBy', 'name');

        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        res.json(dietChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update diet chart
// @route   PUT /api/diet-charts/:id
// @access  Private/Admin
const updateDietChart = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            meals,
            restrictions,
            status
        } = req.body;

        const dietChart = await DietChart.findById(req.params.id);
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        dietChart.startDate = startDate || dietChart.startDate;
        dietChart.endDate = endDate || dietChart.endDate;
        dietChart.meals = meals || dietChart.meals;
        dietChart.restrictions = restrictions || dietChart.restrictions;
        dietChart.status = status || dietChart.status;

        const updatedDietChart = await dietChart.save();
        res.json(updatedDietChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update meal status
// @route   PUT /api/diet-charts/:id/meals/:mealId
// @access  Private
const updateMealStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const dietChart = await DietChart.findById(req.params.id);

        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        const meal = dietChart.meals.id(req.params.mealId);
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        meal.preparationStatus = status;
        if (status === 'ready') {
            meal.preparedBy = req.user._id;
        } else if (status === 'delivered') {
            meal.deliveredBy = req.user._id;
            meal.deliveryTime = new Date();
        }

        await dietChart.save();
        res.json(dietChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createDietChart,
    getDietCharts,
    getDietChartById,
    updateDietChart,
    updateMealStatus
}; 