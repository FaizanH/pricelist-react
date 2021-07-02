import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, NavLink } from "react-bootstrap";

import axios from "axios";
import deployment from "../../../../deployment";
import firebase from "../../../../firebase";

let config = {
    withCredentials: true,
    credentials: "include",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
    }
  };

const AdminSidebar = props => {
    const [openMenu, setOpenState] = useState(true);
    const [menuCollapse, setClass] = useState("d-none d-md-block bg-light nav sidebar");
    const [arrowState, setArrowState] = useState("Collapse");

    useEffect(() => {
    }, [openMenu]);

    const collapseMenu = e => {
        e.preventDefault();
        // Toggle hide menu
        if (!openMenu) {
            setOpenState(true);
            setClass("d-none d-md-block bg-light nav sidebar");
            setArrowState("Collapse")
        } else {
            setOpenState(false);
            setClass("d-none d-md-block bg-light nav sidebar sb-sidenav-collapse");
            setArrowState("Expand")
        }
    }

    const handleLogout = async e => {
        e.preventDefault();
        props.setLoadingState(true);
        firebase.auth().signOut()
                        .then(() => {
                            console.log("Signed out user");
                            props.setLoggedOutState();
                            props.setLoadingState(false);
                        })
    }

    return (
        <Nav className={menuCollapse}>
            <Nav.Link className="menu-link" as={Link} to={"/dashboard"}>Dashboard</Nav.Link>
            <Nav.Link className="menu-link" as={Link} to={"/admin/customers"}>Customers</Nav.Link>
            <Nav.Link className="menu-link" as={Link} to={"/admin/pricing"}>Catalogue</Nav.Link>
            <Nav.Link className="menu-link" as={Link} to={"/admin/products"}>Products</Nav.Link>
            <Nav.Link className="menu-link" as={Link} to={"/admin/users"}>Users</Nav.Link>
            <Nav.Link className="menu-link" as={Link} to={"/dashboard"} disabled>Settings/Tools</Nav.Link>
            <Nav.Link className="menu-link" onClick={handleLogout}>Logout</Nav.Link>
            {/* <Nav.Item className="collapse-menu">
                <Nav.Link className="btn" onClick={collapseMenu}>{arrowState}</Nav.Link>
            </Nav.Item> */}
        </Nav>
    );
}

export default AdminSidebar;