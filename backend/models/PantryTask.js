const mongoose = require('mongoose');

const pantryTaskSchema = new mongoose.Schema({
    dietChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChart',
        required: true
    },
    meal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'assigned_delivery', 'delivered'],
        default: 'pending'
    },
    preparationStartTime: Date,
    preparationEndTime: Date,
    deliveryAssignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryStartTime: Date,
    deliveryCompletionTime: Date,
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('PantryTask', pantryTaskSchema); 