import React, {useState} from 'react';
import '../App.css';
import AppNavbar from './AppNavbar';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';

const Registration = () => {

    const initialFormState = {
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
    };
    const [user, setUser] = useState(initialFormState);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(`/registration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        navigate('/');
    }

    return (
        <div>
            <AppNavbar/>
            <Container>
                {/*<h2>Login</h2>*/}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Username</Label>
                        <Input type="text" name="name" id="name"
                               onChange={handleChange}
                               placeholder="Enter your username"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="phoneNumber">Phone number</Label>
                        <Input type="text" name="phoneNumber" id="phoneNumber"
                               onChange={handleChange}
                               placeholder="Enter your phone number"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="text" name="email" id="email"
                               onChange={handleChange}
                               placeholder="Enter your email"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password"
                               onChange={handleChange}
                               placeholder="Enter your password"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Register</Button>{''}
                        {/*<Button color="secondary" tag={Link} to="/">Cancel</Button>*/}
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}

export default Registration;