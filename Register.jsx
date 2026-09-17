import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        setFormData({
            username: "",
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
                "http://localhost:5000/register",
                formData
            );

            console.log(res.data);

            setFormData({
                username: "",
                email: "",
                password: ""
            });

            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                alert(error.response.data.message || "Registration failed");
            } else {
                alert("Server is not running");
            }
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Register
                </button>

                <Link to="/login">
                    Already have an account? Login here.
                </Link>
            </form>
        </div>
    );
}

export default Register;
