const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient
} = require('../controllers/patientController');

// Define routes with proper middleware and handlers
router.route('/')
    .get(protect, getPatients)
    .post(protect, createPatient);

router.route('/:id')
    .get(protect, getPatientById)
    .put(protect, updatePatient);

module.exports = router; 