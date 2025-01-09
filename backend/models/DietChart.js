const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: String,
    calories: Number,
    specialInstructions: String
});

const mealSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    items: [mealItemSchema],
    timing: String,
    specialInstructions: String
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
    endDate: Date,
    meals: [mealSchema],
    restrictions: [String],
    notes: String,
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DietChart', dietChartSchema); 