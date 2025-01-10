const mongoose = require('mongoose');

const pantryTaskSchema = new mongoose.Schema({
    dietChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChart',
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
        required: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'in_transit', 'delivered'],
        default: 'pending'
    },
    preparationStartTime: Date,
    preparationEndTime: Date,
    specialInstructions: String,
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryStartTime: Date,
    deliveryEndTime: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('PantryTask', pantryTaskSchema); 