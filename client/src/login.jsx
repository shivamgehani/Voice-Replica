import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hardcoded admin login logic
            if (email === "admin" && password === "12345") {
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('email', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('email');
                }
                navigate('/admin-dashboard'); // Redirect to admin dashboard
                return;
            }

            // Regular user login logic
            const response = await axios.post('http://localhost:3001/login', { email, password });
            if (response.data.message === "Successful") {
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('email', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('email');
                }
                navigate('/tutorials'); // Redirect to tutorials page for regular users
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-image"></div>
                <div className="login-box">
                    <h2 className="login-title">Welcome to Login Page </h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="login-label">Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                        />

                        <label htmlFor="password" className="login-label">Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                autoComplete="off"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button
                                type="button"
                                className="show-password"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>

                        <button type="submit" className="login-button">Login</button>
                    </form>

                    <p className="privacy-policy">
                        By logging in, you agree to our <Link to="/privacy-policy">Privacy Policy</Link>.
                    </p>

                    <h2 className="signup-text">Don't have an account? <Link to="/register" className="signup-link">Signup</Link></h2>
                </div>
            </div>
        </div>
    );
}

export default Login;