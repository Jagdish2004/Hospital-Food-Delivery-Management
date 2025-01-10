const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
    getDashboardStats, 
    getReports, 
    getPantryStaff,
    deleteStaff,
    assignTask,
    getPantryStaffList,
    getDeliveryStats,
    getActiveDeliveries,
    getTaskOverview,
    getPendingTasks
} = require('../controllers/managerController');

router.post('/assign-task', protect, authorize('manager'), assignTask);
router.get('/dashboard-stats', protect, authorize('manager'), getDashboardStats);
router.get('/reports', protect, authorize('manager'), getReports);
router.get('/pantry-staff', protect, authorize('manager'), getPantryStaff);
router.delete('/pantry-staff/:id', protect, authorize('manager'), deleteStaff);
router.get('/pantry-staff-list', protect, authorize(['manager', 'admin']), getPantryStaffList);
router.get('/delivery-stats', protect, authorize(['manager', 'admin']), getDeliveryStats);
router.get('/active-deliveries', protect, authorize(['manager', 'admin']), getActiveDeliveries);
router.get('/task-overview', protect, authorize(['manager', 'admin']), getTaskOverview);
router.get('/pending-tasks', protect, authorize(['manager', 'admin']), getPendingTasks);

module.exports = router; 