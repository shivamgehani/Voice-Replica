import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Signup.css'; // Ensure this is imported

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 8 && password.length <= 16;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be between 8 and 16 characters.");
            return;
        }

        axios.post('http://localhost:3001/register', { name, email, password })
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => {
                console.error(err);
                setError("An error occurred during registration. Please try again.");
            });
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-left"></div>
                <div className="signup-right">
                    <h2 className="signup-title">Create Your Account</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit} className="signup-form">
                        <label htmlFor="email" className="signup-label">Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                        />
                        <label htmlFor="name" className="signup-label">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="signup-input"
                        />
                        <label htmlFor="password" className="signup-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signup-input"
                        />
                        <button type="submit" className="signup-button">Register</button>
                    </form>
                    <div className="login-section">
                        <h2 className="login-text">Already have an account? <Link to="/login" className="login-link">Login</Link></h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;