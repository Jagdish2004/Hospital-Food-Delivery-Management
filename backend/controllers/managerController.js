const Patient = require('../models/Patient');
const DietChart = require('../models/DietChart');
const User = require('../models/User');

// @desc    Get manager dashboard statistics
// @route   GET /api/manager/dashboard-stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
    try {
        console.log('Getting dashboard stats...');

        // Get all counts in parallel
        const [
            patientCount,
            dietChartCount,
            pantryStaffCount,
            deliveryStaffCount,
            recentPatients,
            recentDietCharts
        ] = await Promise.all([
            // Count all active patients
            Patient.countDocuments({ active: true }),
            
            // Count active diet charts
            DietChart.countDocuments({ status: 'active' }),
            
            // Count pantry staff
            User.countDocuments({ role: 'pantry', active: true }),
            
            // Count delivery staff
            User.countDocuments({ role: 'delivery', active: true }),
            
            // Get recent patients
            Patient.find({ active: true })
                .sort('-createdAt')
                .limit(5)
                .select('name roomNumber bedNumber')
                .lean(),
            
            // Get recent diet charts
            DietChart.find({ status: 'active' })
                .sort('-createdAt')
                .limit(5)
                .populate('patient', 'name roomNumber')
                .lean()
        ]);

        console.log('Counts fetched:', {
            patientCount,
            dietChartCount,
            pantryStaffCount,
            deliveryStaffCount
        });

        // Get active diet charts for recent patients
        const patientIds = recentPatients.map(p => p._id);
        const activeDietCharts = await DietChart.find({
            patient: { $in: patientIds },
            status: 'active'
        }).select('patient').lean();

        const patientsWithDietCharts = new Set(activeDietCharts.map(c => 
            c.patient.toString()
        ));

        // Add hasDietChart flag to recent patients
        const patientsWithStatus = recentPatients.map(patient => ({
            ...patient,
            hasDietChart: patientsWithDietCharts.has(patient._id.toString())
        }));

        const responseData = {
            stats: {
                patientCount,
                dietChartCount,
                pantryStaffCount,
                deliveryStaffCount
            },
            recentPatients: patientsWithStatus,
            recentDietCharts: recentDietCharts.map(chart => ({
                ...chart,
                startDate: chart.startDate?.toISOString(),
                endDate: chart.endDate?.toISOString()
            }))
        };

        console.log('Sending response:', responseData);
        res.json(responseData);
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            message: 'Error fetching dashboard stats',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getDashboardStats
}; 