import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const remembered = localStorage.getItem("rememberMe") === "true";
        const storedEmail = localStorage.getItem("email");
        if (remembered && storedEmail) {
            setUser({ email: storedEmail });
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
