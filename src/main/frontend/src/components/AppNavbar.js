import React, { useState } from 'react';
import '../App.css';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {

    // const [isOpen, setIsOpen] = useState(false);
    const [navBarUser, setNavBarUser] = useState(undefined);
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    // if(user!=null && user!==""){
    //     setNavBarUser(user);
    //     //setAuthenticated(true);
    // }
    const ifUserLoggedIn = () => {
        if(user!==undefined && user!== null && user!==""){
            if(user.role === "ADMIN"){
                return (
                    <Navbar color="dark" dark expand="md">
                        <NavbarBrand  tag={Link} to="/">Home</NavbarBrand>
                        <Nav tag={Link} to="/accounts">Accounts</Nav>
                        <Nav tag={Link} to="/payments">Payments</Nav>
                        <Nav tag={Link} to="/users">Users</Nav>

                        <Nav tag={Link} to="/login">Login</Nav>
                        <Nav tag={Link} to="/registration">Registration</Nav>
                    </Navbar>
                );
            } else{
                return (
                    <Navbar color="dark" dark expand="md">
                        <NavbarBrand  tag={Link} to="/">Home</NavbarBrand>
                        <Nav tag={Link} to="/accounts">Accounts</Nav>
                        <Nav tag={Link} to="/payments">Payments</Nav>
                        {/*<Nav tag={Link} to="/users">Users</Nav>*/}

                        <Nav tag={Link} to="/login">Login</Nav>
                        <Nav tag={Link} to="/registration">Registration</Nav>
                    </Navbar>
                );
            }

        }else{
            return (
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand  tag={Link} to="/">Home</NavbarBrand>

                    <Nav tag={Link} to="/login">Login</Nav>
                    <Nav tag={Link} to="/registration">Registration</Nav>
                </Navbar>
            );
        }

    }
    return ifUserLoggedIn();
};

export default AppNavbar;