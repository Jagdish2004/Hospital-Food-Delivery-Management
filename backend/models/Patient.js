const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    bedNumber: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    dietaryRestrictions: [String],
    allergies: [String],
    diagnosis: String,
    admissionDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 