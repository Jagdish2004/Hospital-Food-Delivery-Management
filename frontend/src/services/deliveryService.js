import api from './api';
import { toast } from 'react-toastify';

// Delivery-specific service functions
export const deliveryService = {
    // Get tasks assigned to delivery staff
    getMyTasks: async () => {
        try {
            const response = await api.get('/delivery/tasks');
            console.log('Delivery tasks response:', response);
            return { data: response.data || [] };
        } catch (error) {
            console.error('Error fetching delivery tasks:', error);
            if (error.response?.status === 403) {
                toast.error('Not authorized to access delivery tasks');
            }
            return { data: [] };
        }
    },

    // Update delivery status
    updateStatus: async (taskId, status) => {
        try {
            console.log('Updating task status:', { taskId, status }); // Debug log
            
            if (!taskId) {
                throw new Error('Task ID is required');
            }

            const response = await api.put(`/delivery/tasks/${taskId}/status`, { status });
            console.log('Status update response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error updating delivery status:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update delivery status';
            toast.error(errorMessage);
            throw error;
        }
    },

    // Accept a delivery task
    acceptTask: async (taskId) => {
        try {
            const response = await api.put(`/delivery/tasks/${taskId}/accept`);
            toast.success('Task accepted successfully');
            return response.data;
        } catch (error) {
            console.error('Error accepting task:', error);
            toast.error('Failed to accept task');
            throw error;
        }
    }
}; 