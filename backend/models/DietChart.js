const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'],
        required: true
    },
    items: [{
        name: String,
        quantity: String,
        specialInstructions: String
    }],
    specialInstructions: String,
    preparationStatus: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const dietChartSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    meals: [mealSchema],
    specialDietaryInstructions: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DietChart', dietChartSchema); 