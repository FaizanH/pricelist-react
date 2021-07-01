import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, NavLink } from "react-bootstrap";

const AdminMenu = props => {
    return (
        <div className="admin-menu">
            <Navbar className="p-2 w-100" bg="dark" variant="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Brand as={Link} to="/">Pricelist</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="m-auto">
                        <Nav.Link className="" as={Link} to="/catalogue">Catalogue</Nav.Link>
                        <NavDropdown title="Manage" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/products">Manage Products</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Brand className="navbar-user" as={Link} to="/dashboard">{props.user.username.toString()}</Navbar.Brand>
            </Navbar>
        </div>
    )
}

export default AdminMenu;