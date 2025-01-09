const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Manager/Admin/Pantry
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({ active: true })
            .populate({
                path: 'currentDietChart',
                select: 'status startDate endDate'
            })
            .sort('-createdAt');

        const patientsWithDetails = patients.map(patient => ({
            ...patient.toObject(),
            hasDietChart: !!patient.currentDietChart && 
                         patient.currentDietChart.status === 'active'
        }));

        res.json(patientsWithDetails);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Error fetching patients' });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private/Manager/Admin/Pantry
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ message: 'Error fetching patient' });
    }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private/Manager/Admin
const createPatient = async (req, res) => {
    try {
        const {
            name,
            roomNumber,
            bedNumber,
            age,
            gender,
            contactNumber,
            emergencyContact,
            dietaryRestrictions,
            allergies,
            diagnosis
        } = req.body;

        const patient = await Patient.create({
            name,
            roomNumber,
            bedNumber,
            age,
            gender,
            contactNumber,
            emergencyContact,
            dietaryRestrictions,
            allergies,
            diagnosis,
            active: true
        });

        res.status(201).json(patient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(400).json({ 
            message: 'Error creating patient',
            error: error.message 
        });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private/Manager/Admin
const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(400).json({ message: 'Error updating patient' });
    }
};

// @desc    Delete patient (soft delete)
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.active = false;
        await patient.save();

        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ message: 'Error deleting patient' });
    }
};

module.exports = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
}; 