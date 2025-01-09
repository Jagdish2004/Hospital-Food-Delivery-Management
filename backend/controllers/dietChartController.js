const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient');

// @desc    Get all diet charts
// @route   GET /api/diet-charts
// @access  Private/Manager/Admin/Pantry
const getDietCharts = async (req, res) => {
    try {
        const dietCharts = await DietChart.find()
            .populate('patient', 'name roomNumber bedNumber')
            .populate('createdBy', 'name')
            .sort('-createdAt');
        res.json(dietCharts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single diet chart
// @route   GET /api/diet-charts/:id
// @access  Private/Manager/Admin/Pantry
const getDietChartById = async (req, res) => {
    try {
        const dietChart = await DietChart.findById(req.params.id)
            .populate('patient', 'name roomNumber bedNumber')
            .populate('createdBy', 'name');
        
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }
        
        // Transform the data to include patient details
        const response = {
            ...dietChart.toObject(),
            patientName: dietChart.patient?.name,
            patientRoom: dietChart.patient?.roomNumber
        };
        
        res.json(response);
    } catch (error) {
        console.error('Error fetching diet chart:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create diet chart
// @route   POST /api/diet-charts
// @access  Private/Manager/Admin
const createDietChart = async (req, res) => {
    try {
        const { patient, status, meals } = req.body;

        // Validate required fields
        if (!patient || !meals || !Array.isArray(meals)) {
            return res.status(400).json({
                message: 'Patient and meals are required'
            });
        }

        // Create new diet chart
        const dietChart = new DietChart({
            patient,
            status,
            meals: meals.map(meal => ({
                type: meal.type,
                time: meal.time,
                items: Array.isArray(meal.items) ? meal.items : [meal.items],
                calories: meal.calories,
                specialInstructions: meal.specialInstructions
            }))
        });

        await dietChart.save();

        res.status(201).json({
            success: true,
            data: dietChart
        });
    } catch (error) {
        console.error('Error in createDietChart:', error);
        res.status(500).json({
            message: 'Failed to create diet chart',
            error: error.message
        });
    }
};

// @desc    Update diet chart
// @route   PUT /api/diet-charts/:id
// @access  Private/Manager/Admin
const updateDietChart = async (req, res) => {
    try {
        const { startDate, endDate, meals, specialInstructions, status } = req.body;
        
        console.log('Updating diet chart with data:', req.body);

        const dietChart = await DietChart.findById(req.params.id);
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        // Update the fields
        if (startDate) dietChart.startDate = new Date(startDate);
        if (endDate) dietChart.endDate = new Date(endDate);
        if (meals) {
            dietChart.meals = meals.map(meal => ({
                type: meal.type,
                time: meal.time,
                items: meal.items,
                calories: meal.calories || 0,
                specialInstructions: meal.specialInstructions || ''
            }));
        }
        if (specialInstructions !== undefined) dietChart.specialInstructions = specialInstructions;
        if (status) dietChart.status = status;

        const updatedChart = await dietChart.save();
        
        // Populate necessary fields before sending response
        await updatedChart.populate('patient', 'name roomNumber');
        
        console.log('Updated diet chart:', updatedChart);
        res.json(updatedChart);
    } catch (error) {
        console.error('Error updating diet chart:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete diet chart
// @route   DELETE /api/diet-charts/:id
// @access  Private/Admin
const deleteDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart.findById(req.params.id);
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        // Update patient's current diet chart reference
        await Patient.findByIdAndUpdate(dietChart.patient, {
            $unset: { currentDietChart: "" }
        });

        await dietChart.remove();
        res.json({ message: 'Diet chart deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDietCharts,
    getDietChartById,
    createDietChart,
    updateDietChart,
    deleteDietChart
}; 