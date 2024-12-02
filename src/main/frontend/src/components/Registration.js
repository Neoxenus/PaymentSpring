import React, { useState } from 'react';
import '../App.css';
import AppNavbar from './AppNavbar';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Alert } from 'reactstrap';

const Registration = () => {

    const initialFormState = {
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
    };

    const [user, setUser] = useState(initialFormState);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const validate = () => {
        const errors = {};

        // Username validation
        if (!user.name.trim()) {
            errors.name = "Username is required";
        } else if (user.name.length < 3) {
            errors.name = "Username should be at least 3 characters";
        }

        // Phone number validation (example format: 123-456-7890)
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!user.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
        } else if (!phoneRegex.test(user.phoneNumber)) {
            errors.phoneNumber = "Phone number should contain 10-15 digits only";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(user.email)) {
            errors.email = "Invalid email format";
        }

        // Password validation
        if (!user.password) {
            errors.password = "Password is required";
        } else if (user.password.length < 8) {
            errors.password = "Password should be at least 8 characters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form data before sending
        if (!validate()) return;

        fetch(`/registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.ok ? response.json() : response.text())
            .then(data => {
                if (typeof data === "object" && data !== null) {
                    navigate('/');
                } else {
                    setError(data);
                }
            })
            .catch(error => setError("An error occurred during registration."));
    };

    return (
        <div>
            <AppNavbar />
            <Container>
                <h2>Registration</h2>

                {error && <Alert color="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Username</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleChange}
                            placeholder="Enter your username"
                            invalid={!!formErrors.name}
                        />
                        {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="phoneNumber">Phone number</Label>
                        <Input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            invalid={!!formErrors.phoneNumber}
                        />
                        {formErrors.phoneNumber && <div className="text-danger">{formErrors.phoneNumber}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            placeholder="Enter your email"
                            invalid={!!formErrors.email}
                        />
                        {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                            invalid={!!formErrors.password}
                        />
                        {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Register</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default Registration;
