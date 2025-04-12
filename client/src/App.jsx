import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './login';
import Home from './Home';
import Tutorials from './Tutorials';
import Trump from './Trump';
import Shivam from './Shivam'
import NewModelPage from './NewModelPage';
import AdminDashboard from './AdminDashboard';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/trump" element={<Trump />} />
                <Route path="/shivam" element={<Shivam />} />
                <Route path="/newModel" element={<NewModelPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                
                
                
                
              
            </Routes>
        </BrowserRouter>
    );
}

export default App;
