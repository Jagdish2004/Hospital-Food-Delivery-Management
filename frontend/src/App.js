import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import PantryDashboard from './components/dashboard/PantryDashboard';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import DietChartList from './components/diet-charts/DietChartList';
import DietChartForm from './components/diet-charts/DietChartForm';
import PantryManagement from './components/pantry/PantryManagement';
import DeliveryManagement from './components/delivery/DeliveryManagement';
import Reports from './components/admin/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PantryStaff from './components/pantry/PantryStaff';
import MealTasks from './components/pantry/MealTasks';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import Home from './components/Home';
import Signup from './components/auth/Signup';

const theme = createTheme({
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h5: {
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
            }
        }
    }
});

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (location.pathname === '/') {
        return children;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Silently redirect to appropriate dashboard based on role
        if (user.role === 'pantry') {
            return <Navigate to="/pantry-dashboard" replace />;
        } else if (user.role === 'manager') {
            return <Navigate to="/dashboard" replace />;
        } else if (user.role === 'delivery') {
            return <Navigate to="/delivery-dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['manager', 'admin']}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/pantry-dashboard" element={
                            <ProtectedRoute allowedRoles={['pantry']}>
                                <PantryDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/patients" element={
                            <ProtectedRoute>
                                <PatientList />
                            </ProtectedRoute>
                        } />
                        <Route path="/patients/new" element={
                            <ProtectedRoute>
                                <PatientForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/patients/edit/:id" element={
                            <ProtectedRoute>
                                <PatientForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/diet-charts" element={
                            <ProtectedRoute>
                                <DietChartList />
                            </ProtectedRoute>
                        } />
                        <Route path="/diet-charts/new" element={
                            <ProtectedRoute>
                                <DietChartForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/diet-charts/edit/:id" element={
                            <ProtectedRoute>
                                <DietChartForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/pantry-management" element={
                            <ProtectedRoute>
                                <PantryManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/delivery-management" element={
                            <ProtectedRoute>
                                <DeliveryManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <Reports />
                            </ProtectedRoute>
                        } />
                        <Route path="/pantry-staff" element={
                            <ProtectedRoute>
                                <PantryStaff />
                            </ProtectedRoute>
                        } />
                        <Route path="/meal-tasks" element={
                            <ProtectedRoute allowedRoles={['pantry', 'manager']}>
                                <MealTasks />
                            </ProtectedRoute>
                        } />
                        <Route path="/delivery-dashboard" element={
                            <ProtectedRoute allowedRoles={['delivery']}>
                                <DeliveryDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                    <ToastContainer />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
