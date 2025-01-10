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

// @desc    Assign task to pantry staff
// @route   POST /api/manager/assign-task
// @access  Private/Manager
const assignTask = async (req, res) => {
    try {
        const {
            dietChart,
            meal,
            mealType,
            scheduledTime,
            assignedTo,
            specialInstructions
        } = req.body;

        // Validate required fields
        if (!dietChart || !meal || !mealType || !scheduledTime || !assignedTo) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }

        const task = await PantryTask.create({
            dietChart,
            meal,
            mealType,
            scheduledTime,
            assignedTo,
            specialInstructions,
            status: 'pending'
        });

        // Populate necessary fields
        await task.populate([
            {
                path: 'dietChart',
                populate: {
                    path: 'patient',
                    select: 'name roomNumber'
                }
            },
            {
                path: 'assignedTo',
                select: 'name'
            }
        ]);

        // Send success response with created task
        res.status(201).json({
            success: true,
            message: 'Task assigned successfully',
            task
        });

    } catch (error) {
        console.error('Error in assignTask:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to assign task',
            error: error.message 
        });
    }
};

const getPantryStaffList = async (req, res) => {
    try {
        const pantryStaff = await User.find({ role: 'pantry' })
            .populate({
                path: 'pantry',
                select: 'name capacity staffMembers',
                populate: {
                    path: 'staffMembers',
                    select: 'name email contactNumber'
                }
            })
            .select('-password')
            .sort('name');

        console.log('Found pantry staff:', pantryStaff.length);
        res.json(pantryStaff);
    } catch (error) {
        console.error('Error in getPantryStaffList:', error);
        res.status(500).json({ 
            message: 'Failed to fetch pantry staff list',
            error: error.message 
        });
    }
};

const getDeliveryStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [ready, inTransit, delivered] = await Promise.all([
            PantryTask.countDocuments({ status: 'ready' }),
            PantryTask.countDocuments({ status: 'in_transit' }),
            PantryTask.countDocuments({ 
                status: 'delivered',
                deliveryEndTime: { $gte: today }
            })
        ]);

        res.json({
            ready,
            inTransit,
            delivered
        });
    } catch (error) {
        console.error('Error in getDeliveryStats:', error);
        res.status(500).json({ 
            message: 'Failed to fetch delivery stats',
            error: error.message 
        });
    }
};

// Get active deliveries
const getActiveDeliveries = async (req, res) => {
    try {
        const activeDeliveries = await PantryTask.find({
            status: 'in_transit'
        })
        .populate({
            path: 'dietChart',
            populate: {
                path: 'patient',
                select: 'name roomNumber'
            }
        })
        .populate('deliveryPerson', 'name')
        .sort('-updatedAt')
        .limit(10);

        console.log('Found active deliveries:', activeDeliveries.length);
        res.json(activeDeliveries);
    } catch (error) {
        console.error('Error in getActiveDeliveries:', error);
        res.status(500).json({ message: 'Failed to fetch active deliveries' });
    }
};

// Get task overview
const getTaskOverview = async (req, res) => {
    try {
        const tasks = await PantryTask.find()
            .populate({
                path: 'dietChart',
                populate: {
                    path: 'patient',
                    select: 'name roomNumber'
                }
            })
            .populate('assignedTo', 'name')
            .sort('-createdAt');

        const overview = {
            pending: tasks.filter(t => t.status === 'pending').length,
            preparing: tasks.filter(t => t.status === 'preparing').length,
            ready: tasks.filter(t => t.status === 'ready').length,
            inTransit: tasks.filter(t => t.status === 'in_transit').length,
            delivered: tasks.filter(t => t.status === 'delivered').length
        };

        res.json(overview);
    } catch (error) {
        console.error('Error in getTaskOverview:', error);
        res.status(500).json({ message: 'Failed to fetch task overview' });
    }
};

const getPendingTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find({
            status: { $in: ['ready', 'pending'] }
        })
        .populate({
            path: 'dietChart',
            populate: {
                path: 'patient',
                select: 'name roomNumber'
            }
        })
        .populate('assignedTo', 'name')
        .sort('-createdAt');

        res.json(tasks);
    } catch (error) {
        console.error('Error in getPendingTasks:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch pending tasks',
            error: error.message 
        });
    }
};

module.exports = {
    getDashboardStats,
    getReports,
    getPantryStaff,
    deleteStaff,
    assignTask,
    getPantryStaffList,
    getDeliveryStats,
    getActiveDeliveries,
    getTaskOverview,
    getPendingTasks
}; 