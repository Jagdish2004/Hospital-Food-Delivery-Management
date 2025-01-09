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
        const { patient, startDate, endDate, meals, specialInstructions } = req.body;

        // Check if patient exists
        const existingPatient = await Patient.findById(patient);
        if (!existingPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check for active diet chart
        const activeChart = await DietChart.findOne({
            patient,
            status: 'active'
        });

        if (activeChart) {
            return res.status(400).json({ 
                message: 'Patient already has an active diet chart' 
            });
        }

        const dietChart = new DietChart({
            patient,
            startDate,
            endDate,
            meals,
            specialInstructions,
            createdBy: req.user._id
        });

        const savedChart = await dietChart.save();

        // Update patient's current diet chart
        existingPatient.currentDietChart = savedChart._id;
        await existingPatient.save();

        res.status(201).json(savedChart);
    } catch (error) {
        res.status(400).json({ message: error.message });
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