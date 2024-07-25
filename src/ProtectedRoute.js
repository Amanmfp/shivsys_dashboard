import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Authenticated } from './lib/constants'
const ProtectedRoute = ({ children }) => {
    const isAuthenticated  = Authenticated;
// const isAuthenticated=true
    const location = useLocation()
    console.log('isAuthenticated', isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
 

    return children
}
export default ProtectedRoute

