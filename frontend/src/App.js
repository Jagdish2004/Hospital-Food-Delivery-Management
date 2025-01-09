import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import PantryDashboard from './components/dashboard/PantryDashboard';
import DeliveryDashboard from './components/dashboard/DeliveryDashboard';
import DietChartForm from './components/diet-charts/DietChartForm';
import DietChartList from './components/diet-charts/DietChartList';
import PatientView from './components/patients/PatientView';
import DietChartView from './components/diet-charts/DietChartView';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2'
        }
    }
});

// Dashboard selector component
const DashboardSelector = () => {
    const { user } = useAuth();

    switch (user?.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        case 'pantry':
            return <PantryDashboard />;
        case 'delivery':
            return <DeliveryDashboard />;
        default:
            return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <Routes>
                                            <Route path="/dashboard" element={<DashboardSelector />} />
                                            <Route path="/patients" element={<PatientList />} />
                                            <Route path="/patients/new" element={<PatientForm />} />
                                            <Route path="/patients/edit/:id" element={<PatientForm />} />
                                            <Route path="/patients/view/:id" element={<PatientView />} />
                                            <Route path="/diet-charts" element={<DietChartList />} />
                                            <Route path="/diet-charts/new" element={<DietChartForm />} />
                                            <Route path="/diet-charts/new/:patientId" element={<DietChartForm />} />
                                            <Route path="/diet-charts/edit/:chartId" element={<DietChartForm />} />
                                            <Route path="/diet-charts/view/:id" element={<DietChartView />} />
                                        </Routes>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <ToastContainer />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
