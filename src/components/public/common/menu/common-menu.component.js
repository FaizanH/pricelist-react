import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, NavLink } from "react-bootstrap";

const Menu = props => {
    return (
        <div className="menu">
            <Navbar className="p-2 w-100" bg="dark" variant="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand as={Link} to="/">Pricelist</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                </Navbar.Collapse>
                <Navbar.Brand className="navbar-user" as={Link} to="/login">Login</Navbar.Brand>
            </Navbar>
        </div>
    )
}

export default Menu;