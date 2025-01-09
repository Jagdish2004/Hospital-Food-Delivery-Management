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
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    preparationStartTime: Date,
    preparationEndTime: Date,
    deliveryStartTime: Date,
    deliveryCompletionTime: Date,
    preparationNotes: String,
    deliveryNotes: String,
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    temperature: Number,
    qualityCheck: {
        checked: {
            type: Boolean,
            default: false
        },
        checkedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        checkedAt: Date,
        notes: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PantryTask', pantryTaskSchema); 