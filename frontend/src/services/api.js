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
        console.error('API Error:', error);
        
        const message = error.response?.data?.message || 'An error occurred';
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
        } else {
            toast.error(message);
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
export const createDietChart = (data) => api.post('/diet-charts', data);
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
export const getPantryTasks = () => api.get('/api/pantry/tasks');
export const getMyTasks = () => api.get('/pantry-tasks/my-tasks');
export const updateTaskStatus = (taskId, status) => 
    api.put(`/api/pantry/tasks/${taskId}/status`, { status });
export const assignDeliveryPersonnel = (taskId, deliveryPersonId) =>
    api.put(`/api/pantry/tasks/${taskId}/assign`, { deliveryPersonId });

// Delivery endpoints
export const getDeliveryTasks = () => api.get('/api/delivery/tasks');
export const updateDeliveryStatus = (taskId, status, notes) => 
    api.put(`/api/delivery/tasks/${taskId}/status`, { status, notes });

// Staff endpoints
export const getDeliveryStaff = () => api.get('/api/users/delivery-staff');
export const getPantryStaff = () => api.get('/api/users/pantry-staff');

// Manager specific endpoints
export const getManagerStats = async () => {
    try {
        console.log('Fetching manager stats...');
        const response = await api.get('/manager/dashboard-stats');
        console.log('Manager stats raw response:', response);

        if (!response.data) {
            throw new Error('No data received from server');
        }

        return response.data;
    } catch (error) {
        console.error('Error in getManagerStats:', error);
        throw error;
    }
};

export const getDeliveryStatus = () => api.get('/delivery/status');
export const assignTask = (taskData) => api.post('/pantry/tasks', taskData);

export default api; 