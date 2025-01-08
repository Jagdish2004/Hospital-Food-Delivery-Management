const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient
} = require('../controllers/patientController');

router.route('/')
    .get(protect, getPatients)
    .post(protect, admin, createPatient);

router.route('/:id')
    .get(protect, getPatientById)
    .put(protect, admin, updatePatient);

module.exports = router; 