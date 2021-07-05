import React, { Component, useState } from "react";
import { Redirect } from "react-router";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import firebase from "../../../firebase";

import { addUser } from "../../../services/services";

const CreateUser = props => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [first_name, setfirstname] = useState("");
    const [last_name, setlastname] = useState("");
    const [email_address, setemail] = useState("");
    const [permission_group, setPermissionsGroup] = useState("");

    const permissions_options = [
        {label: "Standard User", value: 0},
        {label: "Administrator", value: 1}
    ]

    const handleRegister = async e => {
        e.preventDefault();
        props.setLoadingState(true);
        const user = {
            username,
            password,
            first_name,
            last_name,
            email_address,
            permission_group
        };
        const res = await addUser(user);
        if (res) {
            if (res.err)
                console.log("An error occured");
            else if (res.data == "Username already exists")
                console.log("Error: " + res.data);
            // firebase.auth().createUser(email_address, password)
            //                 .then((user) => {
            //                     console.log(user);
            //                 })
            //                 .catch(err => console.error(err))
            props.setLoadingState(false);
            window.location = "/admin/users";
        }
    }

    return (
        <div>
            <h1>Create Account</h1>
            <Form onSubmit={handleRegister}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" required value={username} onChange={e => setusername(e.target.value)} placeholder="Enter Username"/>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" value={first_name} onChange={e => setfirstname(e.target.value)} placeholder="Enter First Name"/>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" value={last_name} onChange={e => setlastname(e.target.value)} placeholder="Enter Last Name"/>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" value={email_address} onChange={e => setemail(e.target.value)} placeholder="Enter Email"/>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required value={password} onChange={e => setpassword(e.target.value)} placeholder="Enter Password"/>
                    <Form.Label>Permission Group</Form.Label>
                    <Select options={permissions_options} defaultValue={permissions_options[0]} onChange={e => setPermissionsGroup(e.label)} />
                </Form.Group>
                <Button as={Link} to="/admin/users" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Signup</Button>
            </Form>
        </div>
    )
}

export default CreateUser;