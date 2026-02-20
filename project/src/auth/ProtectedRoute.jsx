import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthUser } from './auth';

export default function ProtectedRoute({ children }) {
    const user = getAuthUser();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
