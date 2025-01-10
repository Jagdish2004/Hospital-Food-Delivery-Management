import api from './api';

export const managerService = {
    // Get pantry staff list for manager dashboard
    getPantryStaffList: async () => {
        try {
            const response = await api.get('/manager/pantry-staff-list');
            console.log('Pantry staff response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching pantry staff:', error);
            return [];
        }
    },

    // Get pantry tasks for manager dashboard
    getManagerPantryTasks: async () => {
        try {
            const response = await api.get('/manager/pantry-tasks');
            return response.data;
        } catch (error) {
            console.error('Error fetching manager pantry tasks:', error);
            return [];
        }
    },

    // Get delivery stats for manager dashboard
    getDeliveryStats: async () => {
        try {
            const response = await api.get('/manager/delivery-stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching delivery stats:', error);
            return {
                ready: 0,
                inTransit: 0,
                delivered: 0
            };
        }
    },

    // Get active deliveries
    getActiveDeliveries: async () => {
        try {
            const response = await api.get('/manager/active-deliveries');
            console.log('Active deliveries response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching active deliveries:', error);
            return [];
        }
    },

    // Get task overview data
    getTaskOverview: async () => {
        try {
            const response = await api.get('/manager/task-overview');
            console.log('Task overview response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching task overview:', error);
            return [];
        }
    }
}; 