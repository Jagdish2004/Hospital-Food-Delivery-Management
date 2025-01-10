const PantryTask = require('../models/PantryTask');
const mongoose = require('mongoose');

// Get delivery tasks including ready tasks
const getDeliveryTasks = async (req, res) => {
    try {
        // Fetch both ready tasks and tasks assigned to this delivery person
        const tasks = await PantryTask.find({
            $or: [
                { status: 'ready' }, // Get all ready tasks
                { 
                    deliveryPerson: req.user._id,
                    status: { $in: ['in_transit', 'delivered'] }
                }
            ]
        })
        .populate({
            path: 'dietChart',
            populate: {
                path: 'patient',
                select: 'name roomNumber'
            }
        })
        .sort('scheduledTime');

        console.log('Found tasks:', tasks); // Debug log
        res.json(tasks);
    } catch (error) {
        console.error('Error in getDeliveryTasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        // Validate taskId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        console.log('Updating task:', { taskId, status, userId: req.user._id }); // Debug log

        const task = await PantryTask.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // For ready tasks being picked up
        if (status === 'in_transit' && task.status === 'ready') {
            task.deliveryPerson = req.user._id;
            task.deliveryStartTime = new Date();
            task.status = status;
        }
        // For in_transit tasks being delivered
        else if (status === 'delivered' && task.status === 'in_transit') {
            // Check if this delivery person owns the task
            if (!task.deliveryPerson || task.deliveryPerson.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    message: 'Not authorized to deliver this task' 
                });
            }
            task.deliveryEndTime = new Date();
            task.status = status;
        } else {
            return res.status(400).json({ 
                message: `Invalid status transition from ${task.status} to ${status}` 
            });
        }

        await task.save();

        // Populate necessary data before sending response
        await task.populate({
            path: 'dietChart',
            populate: {
                path: 'patient',
                select: 'name roomNumber'
            }
        });

        console.log('Updated task:', task); // Debug log
        res.json(task);
    } catch (error) {
        console.error('Error in updateDeliveryStatus:', error);
        res.status(400).json({ 
            message: 'Failed to update delivery status',
            error: error.message 
        });
    }
};

module.exports = {
    getDeliveryTasks,
    updateDeliveryStatus
}; 