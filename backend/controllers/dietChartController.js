const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient');

// @desc    Get all diet charts
// @route   GET /api/diet-charts
// @access  Private/Manager/Admin/Pantry
const getDietCharts = async (req, res) => {
    try {
        const dietCharts = await DietChart.find()
            .populate('patient', 'name roomNumber')
            .populate('createdBy', 'name')
            .sort('-createdAt');
        res.json(dietCharts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching diet charts' });
    }
};

// @desc    Get single diet chart
// @route   GET /api/diet-charts/:id
// @access  Private/Manager/Admin/Pantry
const getDietChartById = async (req, res) => {
    try {
        const dietChart = await DietChart.findById(req.params.id)
            .populate('patient', 'name roomNumber')
            .populate('createdBy', 'name');
        
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }
        
        res.json(dietChart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching diet chart' });
    }
};

// @desc    Create diet chart
// @route   POST /api/diet-charts
// @access  Private/Manager/Admin
const createDietChart = async (req, res) => {
    try {
        const { patient, startDate, endDate, meals } = req.body;

        // Verify patient exists
        const patientExists = await Patient.findById(patient);
        if (!patientExists) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const dietChart = await DietChart.create({
            patient,
            startDate,
            endDate,
            meals,
            createdBy: req.user._id
        });

        res.status(201).json(dietChart);
    } catch (error) {
        res.status(400).json({ 
            message: 'Error creating diet chart',
            error: error.message 
        });
    }
};

// @desc    Update diet chart
// @route   PUT /api/diet-charts/:id
// @access  Private/Manager/Admin
const updateDietChart = async (req, res) => {
    try {
        const dietChart = await DietChart.findById(req.params.id);
        if (!dietChart) {
            return res.status(404).json({ message: 'Diet chart not found' });
        }

        const updatedDietChart = await DietChart.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedBy: req.user._id
            },
            { new: true, runValidators: true }
        );

        res.json(updatedDietChart);
    } catch (error) {
        res.status(400).json({ message: 'Error updating diet chart' });
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

        await dietChart.remove();
        res.json({ message: 'Diet chart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting diet chart' });
    }
};

module.exports = {
    getDietCharts,
    getDietChartById,
    createDietChart,
    updateDietChart,
    deleteDietChart
}; 