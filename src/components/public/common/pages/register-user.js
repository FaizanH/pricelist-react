import React, { Component, useState } from "react";
import { Redirect } from "react-router";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../../deployment";
import firebase from "../../../../firebase";

import { addUser } from "../../../../services/services";

const config = {
    withCredentials: true,
    credentials: "include",
    headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
    }
};

const Register = props => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [first_name, setfirstname] = useState("");
    const [last_name, setlastname] = useState("");
    const [email_address, setemail] = useState("");
    const [permission_group, setpermissions] = useState("");

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
        // Create user in Mongo
        if (res) {
            if (res.err)
                console.log("An error occured");
            else if (res.data == "Username already exists")
                console.log("Error: " + res.data);
            firebase.auth().createUserWithEmailAndPassword(email_address, password)
                            .then((user) => {
                                console.log(user);
                            })
                            .catch(err => console.error(err))
            props.setLoadingState(false);
        }
    }

    if (props.isLoggedIn) {
        console.log("You are already logged in")
        return <Redirect to={props.successRoute} />;
    }

    return (
        <div>
            <h1>Register Account</h1>
            <Form onSubmit={handleRegister}>
                <Form.Group>
                    <Form.Control type="username" required value={username} onChange={e => setusername(e.target.value)} placeholder="Enter Username"/>
                    <Form.Control type="text" value={first_name} onChange={e => setfirstname(e.target.value)} placeholder="Enter First Name"/>
                    <Form.Control type="text" value={last_name} onChange={e => setlastname(e.target.value)} placeholder="Enter Last Name"/>
                    <Form.Control type="email" value={email_address} onChange={e => setemail(e.target.value)} placeholder="Enter Email"/>
                    <Form.Control type="password" required value={password} onChange={e => setpassword(e.target.value)} placeholder="Enter Password"/>
                    <Form.Label>Access Level</Form.Label>
                    <Form.Control as="select" aria-label="Permissions Select" value={permission_group} onChange={e => setpermissions(e.target.value)}>
                        <option defaultValue>Standard</option>
                        <option>Administrator</option>
                    </Form.Control>
                </Form.Group>
                <Button as={Link} to="/" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Signup</Button>
            </Form>
        </div>
    )
}

export default Register;