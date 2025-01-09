const mongoose = require('mongoose');

const pantryTaskSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChart',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'assigned_delivery', 'in_transit', 'delivered'],
        default: 'pending'
    },
    preparationStartTime: Date,
    preparationEndTime: Date,
    deliveryAssignedTime: Date,
    deliveryStartTime: Date,
    deliveryCompletionTime: Date,
    deliveryNotes: String,
    specialInstructions: String
}, {
    timestamps: true
});

module.exports = mongoose.model('PantryTask', pantryTaskSchema); 