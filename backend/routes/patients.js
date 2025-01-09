const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

// Protect all routes
router.use(protect);

// Routes that require manager or admin role
router.route('/')
    .get(authorize('manager', 'admin', 'pantry'), getPatients)
    .post(authorize('manager', 'admin'), createPatient);

router.route('/:id')
    .get(authorize('manager', 'admin', 'pantry'), getPatientById)
    .put(authorize('manager', 'admin'), updatePatient)
    .delete(authorize('admin'), deletePatient);

module.exports = router; 