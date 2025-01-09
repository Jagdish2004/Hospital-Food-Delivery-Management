const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({});
        res.json(patients);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (patient) {
            Object.assign(patient, req.body);
            const updatedPatient = await patient.save();
            res.json(updatedPatient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient
}; 