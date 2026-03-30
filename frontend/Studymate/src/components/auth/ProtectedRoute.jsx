import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';


const ProtectedRoute = () => {
const isLoading = false ; 
const isAuthenticated = true;
  return isAuthenticated ? (
    <AppLayout>
        <Outlet/>
    </AppLayout>
  ):(
    <Navigate to={'/login'} replace/>
  );
}

export default ProtectedRoute
