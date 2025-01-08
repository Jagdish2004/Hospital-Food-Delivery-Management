const PantryTask = require('../models/PantryTask');
const DietChart = require('../models/DietChart');

// @desc    Get all pantry tasks
// @route   GET /api/pantry-tasks
// @access  Private
const getPantryTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find({})
            .populate({
                path: 'dietChart',
                populate: {
                    path: 'patient',
                    select: 'name roomNumber bedNumber'
                }
            })
            .populate('assignedTo', 'name')
            .populate('deliveryAssignedTo', 'name')
            .sort('-createdAt');

        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get pantry tasks assigned to logged-in user
// @route   GET /api/pantry-tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find({
            $or: [
                { assignedTo: req.user._id },
                { deliveryAssignedTo: req.user._id }
            ]
        })
        .populate({
            path: 'dietChart',
            populate: {
                path: 'patient',
                select: 'name roomNumber bedNumber'
            }
        })
        .sort('-createdAt');

        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update pantry task status
// @route   PUT /api/pantry-tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await PantryTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;

        if (status === 'preparing') {
            task.preparationStartTime = new Date();
        } else if (status === 'ready') {
            task.preparationEndTime = new Date();
        } else if (status === 'assigned_delivery') {
            task.deliveryStartTime = new Date();
        } else if (status === 'delivered') {
            task.deliveryCompletionTime = new Date();
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Assign delivery personnel to task
// @route   PUT /api/pantry-tasks/:id/assign-delivery
// @access  Private/Pantry
const assignDeliveryPersonnel = async (req, res) => {
    try {
        const { deliveryPersonId } = req.body;
        const task = await PantryTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.deliveryAssignedTo = deliveryPersonId;
        task.status = 'assigned_delivery';
        task.deliveryStartTime = new Date();

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPantryTasks,
    getMyTasks,
    updateTaskStatus,
    assignDeliveryPersonnel
}; 