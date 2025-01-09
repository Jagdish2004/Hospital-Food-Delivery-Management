const Pantry = require('../models/Pantry');
const PantryTask = require('../models/PantryTask');
const User = require('../models/User');
const DietChart = require('../models/DietChart');

// Get all pantries
const getPantries = async (req, res) => {
    try {
        const pantries = await Pantry.find()
            .populate('staffMembers', 'name role');
        res.json(pantries);
    } catch (error) {
        console.error('Error in getPantries:', error);
        res.status(500).json({ message: 'Failed to fetch pantries' });
    }
};

// Create pantry
const createPantry = async (req, res) => {
    try {
        const { name, location, contactNumber, status } = req.body;
        
        const pantry = new Pantry({
            name,
            location,
            contactNumber,
            status: status || 'active'
        });

        await pantry.save();
        res.status(201).json(pantry);
    } catch (error) {
        console.error('Error in createPantry:', error);
        res.status(400).json({ message: 'Failed to create pantry' });
    }
};

// Assign staff to pantry
const assignStaffToPantry = async (req, res) => {
    try {
        const { pantryId, staffId } = req.params;
        const pantry = await Pantry.findById(pantryId);
        if (!pantry) {
            return res.status(404).json({ message: 'Pantry not found' });
        }

        const staff = await User.findById(staffId);
        if (!staff || staff.role !== 'pantry') {
            return res.status(404).json({ message: 'Staff member not found or not a pantry staff' });
        }

        if (!pantry.staffMembers.includes(staffId)) {
            pantry.staffMembers.push(staffId);
            await pantry.save();
        }

        res.json(pantry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks for pantry staff
const getPantryTasks = async (req, res) => {
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
            .populate('deliveryPerson', 'name')
            .sort('scheduledTime');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks assigned to specific staff member
const getMyTasks = async (req, res) => {
    try {
        const tasks = await PantryTask.find({ assignedTo: req.user._id })
            .populate({
                path: 'dietChart',
                populate: {
                    path: 'patient',
                    select: 'name roomNumber'
                }
            })
            .sort('scheduledTime');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new task
const createPantryTask = async (req, res) => {
    try {
        const {
            dietChartId,
            mealId,
            mealType,
            scheduledTime,
            assignedTo
        } = req.body;

        const task = await PantryTask.create({
            dietChart: dietChartId,
            meal: mealId,
            mealType,
            scheduledTime,
            assignedTo
        });

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

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status, notes, temperature } = req.body;

        const task = await PantryTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update status and related timestamps
        task.status = status;
        switch (status) {
            case 'preparing':
                task.preparationStartTime = new Date();
                task.preparationNotes = notes;
                break;
            case 'ready':
                task.preparationEndTime = new Date();
                task.temperature = temperature;
                break;
            case 'out_for_delivery':
                task.deliveryStartTime = new Date();
                break;
            case 'delivered':
                task.deliveryCompletionTime = new Date();
                task.deliveryNotes = notes;
                break;
        }

        await task.save();
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
            },
            {
                path: 'deliveryPerson',
                select: 'name'
            }
        ]);

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assign delivery personnel
const assignDeliveryPerson = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { deliveryPersonId } = req.body;

        const task = await PantryTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.deliveryPerson = deliveryPersonId;
        await task.save();
        await task.populate('deliveryPerson', 'name');

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Quality check
const performQualityCheck = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { notes } = req.body;

        const task = await PantryTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.qualityCheck = {
            checked: true,
            checkedBy: req.user._id,
            checkedAt: new Date(),
            notes
        };

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPantryById = async (req, res) => {
    try {
        const pantry = await Pantry.findById(req.params.id)
            .populate('staffMembers', 'name role');
        
        if (!pantry) {
            return res.status(404).json({ message: 'Pantry not found' });
        }
        
        res.json(pantry);
    } catch (error) {
        console.error('Error in getPantryById:', error);
        res.status(500).json({ message: 'Failed to fetch pantry' });
    }
};

const updatePantry = async (req, res) => {
    try {
        const { name, location, contactNumber, status } = req.body;
        
        const pantry = await Pantry.findByIdAndUpdate(
            req.params.id,
            { name, location, contactNumber, status },
            { new: true }
        );

        if (!pantry) {
            return res.status(404).json({ message: 'Pantry not found' });
        }

        res.json(pantry);
    } catch (error) {
        console.error('Error in updatePantry:', error);
        res.status(400).json({ message: 'Failed to update pantry' });
    }
};

module.exports = {
    getPantries,
    createPantry,
    assignStaffToPantry,
    getPantryTasks,
    getMyTasks,
    createPantryTask,
    updateTaskStatus,
    assignDeliveryPerson,
    performQualityCheck,
    getPantryById,
    updatePantry
}; 