const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner']
    },
    items: [{
        name: String,
        quantity: String,
        specialInstructions: String
    }],
    specialInstructions: [String],
    preparationStatus: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    preparedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryTime: Date
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
    restrictions: [String],
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