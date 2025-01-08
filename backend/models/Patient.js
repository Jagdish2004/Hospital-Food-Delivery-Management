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
        enum: ['male', 'female', 'other'],
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
    floorNumber: {
        type: String,
        required: true
    },
    diseases: [{
        type: String
    }],
    allergies: [{
        type: String
    }],
    contactNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: String,
        relation: String,
        phone: String
    },
    dietaryRestrictions: [{
        type: String
    }],
    admissionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema); 