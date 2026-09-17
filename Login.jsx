import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        setFormData({
            email: "",
            password: ""
        });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/login",
                formData
            );

            console.log(res.data);

            localStorage.setItem("token", res.data.token);

            setFormData({
                email: "",
                password: ""
            });

            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                alert(error.response.data.message || "Login failed");
            } else {
                alert("Server is not running");
            }
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>

                <h2>Login</h2>

                <input
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                />

                <input
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    required
                />

                <button type="submit">
                    Login
                </button>

                <Link to="/register">
                    Don't have an account? Register here.
                </Link>

            </form>
        </div>
    );
}

export default Login;
