// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading indicator while authentication status is being initialized
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loading component if desired
    }

    return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;