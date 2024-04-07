import React from 'react';
import { Navigate } from 'react-router-dom';

// Assuming isAuthenticated is the same function you've defined above
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Check if token exists
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
