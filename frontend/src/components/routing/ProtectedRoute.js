import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, token } = useAuth();
    const location = useLocation();

    console.log('Protected Route - User:', user); // Debug log
    console.log('Protected Route - Token:', token); // Debug log
    console.log('Current Location:', location.pathname); // Debug log

    if (!user || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 