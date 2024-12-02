import React, {useState} from 'react';
import '../App.css';
import AppNavbar from './AppNavbar';
import {Link, useNavigate} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import {Alert, Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';

const Login = () => {

    const initialFormState = {
        username: '',
        password: '',
    };
    const [user, setUser] = useState(initialFormState);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleChange = (event) => {
        const { name, value } = event.target

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // fetch(`/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: "include",
        //     body: JSON.stringify(user)
        // }).then(response => {
        //     if(response.ok){
        //         return response.json();
        //     }else {
        //         return response.text();
        //     }
        //
        // }
        // ).then(data => {
        //
        //         console.log(data);
        //         // console.log("start");
        //         // setError("1");
        //         // console.log("Error ", error);
        //         if(typeof data === "object" && data !== null){
        //             // console.log("if1");
        //             // const responseUser = JSON.parse(data);
        //             window.sessionStorage.setItem("user", JSON.stringify(data));
        //             // console.log("if12");
        //             // console.log(responseUser);
        //             navigate("/");
        //             // console.log("if14");
        //             setError("");
        //         } else{
        //             // console.log("if2");
        //             setError(data);
        //         }
        //         // setError("");
        //         // console.log("Error ", error);
        //     }
        // );
        window.sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/");
        //return <Navigate to={"/"} replace={true} />;

    }

    return (
        <div>
            <AppNavbar/>
            <Container>
                <h2>Login</h2>
                {error && <Alert color="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
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

                    {/*{error}*/}
                    {/*<br/>*/}
                    <FormGroup>
                        <Button color="primary" type="submit">Login</Button>{''}
                        <Button color="secondary" tag={Link} to="/">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
}

export default Login;