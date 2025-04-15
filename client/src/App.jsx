import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './login';
import Home from './Home';
import Tutorials from './Tutorials';
import Trump from './Trump';
import Shivam from './Shivam';
import NewModelPage from './NewModelPage';
import AdminDashboard from './AdminDashboard';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/tutorials" element={
                        <ProtectedRoute>
                            <Tutorials />
                        </ProtectedRoute>
                    } />
                    <Route path="/trump" element={
                        <ProtectedRoute>
                            <Trump />
                        </ProtectedRoute>
                    } />
                    <Route path="/shivam" element={
                        <ProtectedRoute>
                            <Shivam />
                        </ProtectedRoute>
                    } />
                    <Route path="/newModel" element={
                        <ProtectedRoute>
                            <NewModelPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin-dashboard" element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
