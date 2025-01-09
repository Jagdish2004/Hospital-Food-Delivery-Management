import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const getDietCharts = () => api.get('/diet-charts');
export const getDietChartById = (id) => api.get(`/diet-charts/${id}`);
export const createDietChart = (data) => api.post('/diet-charts', data);
export const updateDietChart = (id, data) => api.put(`/diet-charts/${id}`, data);
export const updateMealStatus = (chartId, mealId, status) => 
    api.put(`/diet-charts/${chartId}/meals/${mealId}`, { status });
export const getPantryTasks = () => api.get('/api/pantry/tasks');
export const getMyTasks = () => api.get('/pantry-tasks/my-tasks');
export const updateTaskStatus = (taskId, status) => 
    api.put(`/api/pantry/tasks/${taskId}/status`, { status });
export const assignDeliveryPersonnel = (taskId, deliveryPersonId) =>
    api.put(`/api/pantry/tasks/${taskId}/assign`, { deliveryPersonId });
export const getDeliveryTasks = () => api.get('/api/delivery/tasks');
export const updateDeliveryStatus = (taskId, status, notes) => 
    api.put(`/api/delivery/tasks/${taskId}/status`, { status, notes });
export const getDashboardStats = () => api.get('/admin/dashboard-stats');
export const getDeliveryStaff = () => api.get('/api/users/delivery-staff');

export default api; 