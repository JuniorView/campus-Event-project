import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        setSuccessMessage(''); // Reset success message
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include' // Include session cookies
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message); // Set success message
                navigate('/dashboard');
            } else {
                setErrorMessage(data.error); // Set error message
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h1>Campus Events Platform </h1>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <input
                    type="text"
                    name="firstName"
                    placeholder="Vorname"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Nachname"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    required
                />
                <button type="submit" className="button">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
