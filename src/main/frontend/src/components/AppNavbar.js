import React, { useState } from 'react';
import '../App.css';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {

    // const [isOpen, setIsOpen] = useState(false);

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
};

export default AppNavbar;