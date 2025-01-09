const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner']
    },
    time: {
        type: String,
        required: true
    },
    items: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        default: 0
    },
    specialInstructions: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered'],
        default: 'pending'
    }
});

const dietChartSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    meals: [mealSchema],
    specialInstructions: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DietChart', dietChartSchema); 