const PantryTask = require('../models/PantryTask');
const User = require('../models/User');

// @desc    Get all pantry tasks
// @route   GET /api/pantry/tasks
// @access  Private/Pantry
const getPantryTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find()
            .populate('patient', 'name roomNumber bedNumber')
            .populate('meal', 'type items specialInstructions')
            .populate('assignedTo', 'name')
            .populate('deliveryPerson', 'name contactNumber')
            .sort('-createdAt');
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PUT /api/pantry/tasks/:id/status
// @access  Private/Pantry
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
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Assign delivery personnel
// @route   PUT /api/pantry/tasks/:id/assign
// @access  Private/Pantry
const assignDeliveryPersonnel = async (req, res) => {
    try {
        const { deliveryPersonId } = req.body;
        const task = await PantryTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.deliveryPerson = deliveryPersonId;
        task.status = 'assigned_delivery';
        task.deliveryAssignedTime = new Date();

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get delivery staff
// @route   GET /api/users/delivery-staff
// @access  Private/Pantry
const getDeliveryStaff = async (req, res) => {
    try {
        const staff = await User.find({ 
            role: 'delivery',
            active: true 
        }).select('name contactNumber');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPantryTasks,
    updateTaskStatus,
    assignDeliveryPersonnel,
    getDeliveryStaff
}; 