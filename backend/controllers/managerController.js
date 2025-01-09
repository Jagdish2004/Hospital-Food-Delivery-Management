const Patient = require('../models/Patient');
const DietChart = require('../models/DietChart');
const PantryTask = require('../models/PantryTask');

// @desc    Get manager dashboard statistics
// @route   GET /api/manager/dashboard-stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
    try {
        // Get counts and recent data
        const [
            patientCount,
            dietChartCount,
            deliveryCount,
            recentPatients,
            recentDietCharts
        ] = await Promise.all([
            Patient.countDocuments({ active: true }),
            DietChart.countDocuments({ status: 'active' }),
            PantryTask.countDocuments({ status: 'pending' }),
            Patient.find({ active: true })
                .sort('-createdAt')
                .limit(5)
                .select('name roomNumber bedNumber age gender contactNumber')
                .lean(),
            DietChart.find({ status: 'active' })
                .sort('-createdAt')
                .limit(5)
                .populate({
                    path: 'patient',
                    select: 'name roomNumber bedNumber'
                })
                .lean()
        ]);

        // Add hasDietChart flag to recent patients
        const patientIds = recentPatients.map(p => p._id);
        const activeCharts = await DietChart.find({
            patient: { $in: patientIds },
            status: 'active'
        }).select('patient').lean();

        const activeChartPatients = new Set(activeCharts.map(c => c.patient.toString()));
        
        const patientsWithDietStatus = recentPatients.map(patient => ({
            ...patient,
            hasDietChart: activeChartPatients.has(patient._id.toString())
        }));

        const responseData = {
            stats: {
                totalPatients: patientCount,
                activeDietCharts: dietChartCount,
                pendingDeliveries: deliveryCount
            },
            recentPatients: patientsWithDietStatus,
            recentDietCharts: recentDietCharts.map(chart => ({
                ...chart,
                startDate: chart.startDate?.toISOString(),
                endDate: chart.endDate?.toISOString()
            }))
        };

        console.log('Sending dashboard data:', responseData);
        res.json(responseData);
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard statistics',
            error: error.message 
        });
    }
};

module.exports = {
    getDashboardStats
}; 