import React, {useEffect, useState} from 'react';
import '../App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import {useCookies} from "react-cookie";

const Home = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(undefined);
    const [cookies] = useCookies(['XSRF-TOKEN']); // <.>

    useEffect(() => {
        setLoading(true);
        const body = {
            "id": 52,
            "name": "admin",
            "email": "admin",
            "phoneNumber": "0000",
            "role": "ADMIN",
            "password": "$2a$10$pvucIvhf9ZtV7Ovmon70T.f0AD/s7pfy0i/Fb6i6P16Et3BVvBPr.",
            "isBlocked": "ACTIVE"
        };
        setUser(body);
        setAuthenticated(true);
        // window.sessionStorage.setItem("user", JSON.stringify(body));
        setLoading(false);
        // fetch('/user', { credentials: 'include' }) // <.>
        //     .then(response => response.text())
        //     .then(body => {
        //         const loggedInUser = JSON.parse(window.sessionStorage.getItem("user"));
        //         console.log("body: ");
        //         console.log(body);
        //
        //         // if (body === '') {
        //         //     setAuthenticated(false);
        //         // } else {
        //         //     setUser(JSON.parse(body));
        //         //     setAuthenticated(true);
        //         // }
        //         if(loggedInUser!=null && loggedInUser!==""){
        //             setUser(loggedInUser);
        //             setAuthenticated(true);
        //             setLoading(false);
        //             return;
        //         }
        //         //console.log(user);
        //         setLoading(false);
        //     });
    }, [setAuthenticated, setLoading, setUser])

    const login = () => {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8080';
        }
        window.location.href = `//${window.location.hostname}${port}/private`;
    }

    const logout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                console.log("response: ");
                console.log(response);

                window.sessionStorage.setItem("user", JSON.stringify(""));
                setUser(null);
                console.log(user);
                //navigate("/");
                setAuthenticated(false);
            });
    }

    const message = user ?
        <h2>Welcome, {user.name}!</h2> :
        <p>Please log in to manage your Payments.</p>;

    const button = authenticated ?
        <div>
            <br/>
            <Button color="primary" onClick={logout}>Logout</Button>
        </div> :
        // <Button color="primary" onClick={login}>Login</Button>;
        <Button color="primary" tag={Link} to="/login">Login</Button>

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                {message}
                {button}
            </Container>
        </div>
    );
}


export default Home;