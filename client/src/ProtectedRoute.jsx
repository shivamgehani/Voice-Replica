import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;