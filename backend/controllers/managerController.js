const Patient = require('../models/Patient');
const DietChart = require('../models/DietChart');
const User = require('../models/User');
const Pantry = require('../models/Pantry');
const PantryTask = require('../models/PantryTask');

// @desc    Get manager dashboard statistics
// @route   GET /api/manager/dashboard-stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            patientCount,
            dietChartCount,
            pantryStaffCount,
            deliveryStaffCount,
            deliveredCount,
            recentPatients,
            recentDietCharts,
            recentPantries,
            recentDeliveries
        ] = await Promise.all([
            Patient.countDocuments({ active: true }),
            DietChart.countDocuments({ status: 'active' }),
            User.countDocuments({ role: 'pantry', active: true }),
            User.countDocuments({ role: 'delivery', active: true }),
            PantryTask.countDocuments({ 
                status: 'delivered',
                deliveryCompletionTime: { $gte: today }
            }),
            Patient.find().sort('-createdAt').limit(5).lean(),
            DietChart.find().populate('patient', 'name').sort('-createdAt').limit(5).lean(),
            Pantry.find().populate('staffMembers', 'name').sort('-createdAt').limit(5).lean(),
            // Only fetch completed deliveries
            PantryTask.find({ 
                status: 'delivered',
                deliveryCompletionTime: { $exists: true }
            })
            .populate({
                path: 'dietChart',
                populate: {
                    path: 'patient',
                    select: 'name roomNumber'
                }
            })
            .populate('deliveryPerson', 'name')
            .sort('-deliveryCompletionTime')
            .limit(10)
            .lean()
        ]);

        // Add recent pantry staff
        const recentPantryStaff = await User.find({ role: 'pantry' })
            .populate('pantry', 'name')
            .select('-password')
            .sort('-createdAt')
            .limit(5);

        res.json({
            stats: {
                patientCount,
                dietChartCount,
                pantryStaffCount,
                deliveryStaffCount,
                deliveredCount
            },
            recentPatients,
            recentDietCharts,
            recentPantries,
            recentDeliveries,
            recentPantryStaff
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        // Get current date
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Aggregate data for reports
        const reports = {
            totalPatients: await Patient.countDocuments(),
            activePatients: await Patient.countDocuments({ status: 'active' }),
            totalDietCharts: await DietChart.countDocuments(),
            activeDietCharts: await DietChart.countDocuments({ status: 'active' }),
            todayDeliveries: await PantryTask.countDocuments({
                status: 'delivered',
                deliveryCompletionTime: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }),
            pantryStats: {
                totalPantries: await Pantry.countDocuments(),
                activePantries: await Pantry.countDocuments({ status: 'active' }),
                totalStaff: await User.countDocuments({ role: 'pantry' })
            },
            mealStats: {
                pending: await PantryTask.countDocuments({ status: 'pending' }),
                preparing: await PantryTask.countDocuments({ status: 'preparing' }),
                ready: await PantryTask.countDocuments({ status: 'ready' }),
                delivered: await PantryTask.countDocuments({ status: 'delivered' })
            }
        };

        res.json(reports);
    } catch (error) {
        console.error('Error in getReports:', error);
        res.status(500).json({ message: 'Failed to fetch reports' });
    }
};

const getPantryStaff = async (req, res) => {
    try {
        const pantryStaff = await User.find({ role: 'pantry' })
            .populate({
                path: 'pantry',
                select: 'name capacity staffMembers',
                populate: {
                    path: 'staffMembers',
                    select: 'name'
                }
            })
            .select('-password');

        res.json(pantryStaff);
    } catch (error) {
        console.error('Error in getPantryStaff:', error);
        res.status(500).json({ message: 'Failed to fetch pantry staff' });
    }
};

const deleteStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // If staff is assigned to a pantry, remove them from pantry's staffMembers
        if (user.pantry) {
            await Pantry.findByIdAndUpdate(user.pantry, {
                $pull: { staffMembers: user._id }
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error in deleteStaff:', error);
        res.status(500).json({ message: 'Failed to delete staff member' });
    }
};

module.exports = {
    getDashboardStats,
    getReports,
    getPantryStaff,
    deleteStaff
}; 