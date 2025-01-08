const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    roomNumber: {
        type: String,
        required: true
    },
    bedNumber: {
        type: String,
        required: true
    },
    floorNumber: {
        type: String,
        required: true
    },
    diseases: [{
        type: String,
        required: true
    }],
    allergies: [{
        type: String
    }],
    contactNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    dietaryRestrictions: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'discharged'],
        default: 'active'
    },
    currentDietChart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChart'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 