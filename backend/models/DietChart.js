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
    items: [{
        type: String,
        required: true
    }],
    calories: {
        type: Number,
        required: true
    },
    specialInstructions: String
});

const dietChartSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    meals: [mealSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('DietChart', dietChartSchema); 