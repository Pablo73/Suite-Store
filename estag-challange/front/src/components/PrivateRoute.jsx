import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute  = ({ user, children }) => {

  if (!user) {
    alert('Unauthenticated user.');
    return <Navigate to="/login" replace />;
  }

  if (user === 'admin') {
    return children;
  } else {
    alert('You do not have the required role to perform this action.');
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoute ;

