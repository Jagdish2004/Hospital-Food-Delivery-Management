import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import PantryDashboard from './components/pantry/PantryDashboard';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import DietChartList from './components/diet-charts/DietChartList';
import DietChartForm from './components/diet-charts/DietChartForm';
import PantryManagement from './components/pantry/PantryManagement';
import DeliveryManagement from './components/delivery/DeliveryManagement';
import Reports from './components/admin/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
    // Add your theme customization here
});

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/pantry-dashboard" element={
                            <ProtectedRoute>
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
                    </Routes>
                    <ToastContainer />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
