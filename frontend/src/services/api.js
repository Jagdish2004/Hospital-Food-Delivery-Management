import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://medimeals.vercel.app/api'
        : 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
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
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
    }
};

// Patient endpoints
export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Diet chart endpoints
export const getDietCharts = async () => {
    try {
        const response = await api.get('/diet-charts');
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching diet charts:', error);
        return { data: [] };
    }
};
export const getDietChartById = (id) => api.get(`/diet-charts/${id}`);
export const createDietChart = async (data) => {
    try {
        const response = await api.post('/diet-charts', {
            patient: data.patient,
            status: data.status,
            meals: data.meals.map(meal => ({
                type: meal.type,
                time: meal.time,
                items: Array.isArray(meal.items) ? meal.items : meal.items.split(',').map(item => item.trim()),
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
                items: Array.isArray(meal.items) ? meal.items : meal.items.split(',').map(item => item.trim()),
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
export const getPantryTasks = async () => {
    try {
        const response = await api.get('/manager/pending-tasks');
        return { 
            success: true,
            data: response.data || [] 
        };
    } catch (error) {
        console.error('Error fetching pantry tasks:', error);
        return { 
            success: false,
            data: [],
            error: error.response?.data?.message || 'Failed to fetch tasks'
        };
    }
};
export const getMyPantryTasks = async () => {
    try {
        const response = await api.get('/pantry/staff/tasks');
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching pantry tasks:', error);
        if (error.response?.status === 403) {
            toast.error('Not authorized to access pantry tasks');
        }
        return { data: [] };
    }
};
export const createPantryTask = (data) => api.post('/pantry/tasks', data);
export const updateTaskStatus = async (taskId, data) => {
    try {
        const response = await api.put(`/pantry/staff/tasks/${taskId}/status`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating task status:', error);
        toast.error('Failed to update task status');
        throw error;
    }
};
export const assignDeliveryPerson = async (taskId, deliveryPersonId) => {
    try {
        const response = await api.put(`/pantry/tasks/${taskId}/assign-delivery`, {
            deliveryPersonId
        });
        return response;
    } catch (error) {
        console.error('Error assigning delivery person:', error);
        throw error;
    }
};
export const performQualityCheck = (taskId, notes) =>
    api.put(`/pantry/tasks/${taskId}/quality-check`, { notes });

// Delivery endpoints
export const getDeliveryTasks = () => api.get('/api/delivery/tasks');

// Staff endpoints
export const getDeliveryStaff = async () => {
    try {
        const response = await api.get('/users/delivery-staff');
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching delivery staff:', error);
        return { data: [] };
    }
};

export const getPantryStaff = () => api.get('/manager/pantry-staff');

export const getDeliveryStatus = () => api.get('/delivery/status');

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

export const assignTask = async (taskData) => {
    try {
        const response = await api.post('/manager/assign-task', taskData);
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
        // Only throw if it's a real error
        if (!error.response || error.response.status !== 201) {
            throw error;
        }
        return error.response.data;
    }
};

// Pantry Management endpoints
export const getPantries = async () => {
    try {
        const response = await api.get('/pantry');
        return { data: response.data || [] };
    } catch (error) {
        console.error('Error fetching pantries:', error);
        throw error;
    }
};

export const createPantry = async (data) => {
    try {
        const response = await api.post('/pantry', data);
        return response.data;
    } catch (error) {
        console.error('Error creating pantry:', error);
        throw error;
    }
};

export const updatePantry = async (id, data) => {
    try {
        const response = await api.put(`/pantry/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating pantry:', error);
        throw error;
    }
};

export const getPantryById = async (id) => {
    try {
        const response = await api.get(`/pantry/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pantry:', error);
        throw error;
    }
};

export const assignStaffToPantry = async (pantryId, staffId) => {
    try {
        const response = await api.post(`/pantry/${pantryId}/staff/${staffId}`);
        return response.data;
    } catch (error) {
        console.error('Error assigning staff to pantry:', error);
        throw error;
    }
};

// Add this with your other API functions
export const getReports = () => api.get('/manager/reports');

// Add these new staff management endpoints
export const createPantryStaff = (data) => api.post('/auth/register', { ...data, role: 'pantry' });
export const updatePantryStaff = (id, data) => api.put(`/api/users/${id}`, data);
export const deletePantryStaff = (id) => api.delete(`/manager/pantry-staff/${id}`);

export default api; 