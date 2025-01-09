import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Silently handle these cases without any messages
        const silentRoutes = [
            '/dashboard',
            '/pantry-dashboard',
            '/delivery-dashboard',
            '/pantry/tasks',
            '/pantry/my-tasks',
            '/manager/dashboard-stats'
        ];

        const shouldHandleSilently = silentRoutes.some(route => 
            error.config.url.includes(route)
        );

        if (!shouldHandleSilently) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            // Don't show any other error messages
        }
        
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Patient endpoints
export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Diet chart endpoints
export const getDietCharts = () => api.get('/diet-charts');
export const getDietChartById = (id) => api.get(`/diet-charts/${id}`);
export const createDietChart = async (data) => {
    try {
        const response = await api.post('/diet-charts', {
            patient: data.patient,
            status: data.status,
            meals: data.meals.map(meal => ({
                type: meal.type,
                time: meal.time,
                items: meal.items.split(',').map(item => item.trim()),
                calories: meal.calories,
                specialInstructions: meal.specialInstructions
            }))
        });
        return response;
    } catch (error) {
        console.error('Error creating diet chart:', error);
        throw error;
    }
};
export const updateDietChart = async (id, data) => {
    try {
        console.log('Updating diet chart with data:', data);
        const response = await api.put(`/diet-charts/${id}`, {
            ...data,
            patient: data.patient,
            meals: data.meals.map(meal => ({
                type: meal.type,
                time: meal.time,
                items: meal.items,
                calories: meal.calories,
                specialInstructions: meal.specialInstructions
            }))
        });
        return response.data;
    } catch (error) {
        console.error('Error updating diet chart:', error);
        throw error;
    }
};
export const updateMealStatus = (chartId, mealId, status) => 
    api.put(`/diet-charts/${chartId}/meals/${mealId}`, { status });
export const deleteDietChart = (id) => api.delete(`/diet-charts/${id}`);

// Pantry endpoints
export const getPantryTasks = () => api.get('/pantry/tasks');
export const getMyPantryTasks = () => api.get('/pantry/my-tasks');
export const createPantryTask = (data) => api.post('/pantry/tasks', data);
export const updateTaskStatus = (taskId, data) => 
    api.put(`/pantry/tasks/${taskId}/status`, data);
export const assignDeliveryPerson = (taskId, deliveryPersonId) =>
    api.put(`/pantry/tasks/${taskId}/assign-delivery`, { deliveryPersonId });
export const performQualityCheck = (taskId, notes) =>
    api.put(`/pantry/tasks/${taskId}/quality-check`, { notes });

// Delivery endpoints
export const getDeliveryTasks = () => api.get('/api/delivery/tasks');
export const updateDeliveryStatus = (taskId, status, notes) => 
    api.put(`/api/delivery/tasks/${taskId}/status`, { status, notes });

// Staff endpoints
export const getDeliveryStaff = () => api.get('/api/users/delivery-staff');
export const getPantryStaff = () => api.get('/manager/pantry-staff');

// Manager specific endpoints
export const getManagerStats = async () => {
    try {
        const response = await api.get('/manager/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error('Error in getManagerStats:', error);
        throw error;
    }
};

export const getDeliveryStatus = () => api.get('/delivery/status');
export const assignTask = (taskData) => api.post('/pantry/tasks', taskData);

// Pantry Management endpoints
export const getPantries = () => api.get('/pantry');
export const createPantry = (data) => api.post('/pantry', data);
export const updatePantry = (id, data) => api.put(`/pantry/${id}`, data);
export const getPantryById = (id) => api.get(`/pantry/${id}`);
export const assignStaffToPantry = (pantryId, staffId) => 
    api.post(`/pantry/${pantryId}/staff/${staffId}`);

// Add this with your other API functions
export const getReports = () => api.get('/manager/reports');

// Add these new staff management endpoints
export const createPantryStaff = (data) => api.post('/auth/register', { ...data, role: 'pantry' });
export const updatePantryStaff = (id, data) => api.put(`/api/users/${id}`, data);
export const deletePantryStaff = (id) => api.delete(`/manager/pantry-staff/${id}`);

export default api; 