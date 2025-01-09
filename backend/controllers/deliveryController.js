const PantryTask = require('../models/PantryTask');

// @desc    Get delivery tasks for logged-in delivery person
// @route   GET /api/delivery/tasks
// @access  Private/Delivery
const getDeliveryTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find({ 
            deliveryPerson: req.user._id,
            status: { $in: ['assigned', 'in_transit', 'delivered'] }
        })
        .populate('patient', 'name roomNumber bedNumber')
        .populate('meal', 'type items specialInstructions')
        .sort('-createdAt');
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/tasks/:id/status
// @access  Private/Delivery
const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const task = await PantryTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.deliveryPerson.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.status = status;
        task.deliveryNotes = notes;

        if (status === 'in_transit') {
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

module.exports = {
    getDeliveryTasks,
    updateDeliveryStatus
}; 