import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Redirect } from "react-router";
import firebase from "../../../../firebase";

const Login = props => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const handleLogin = async e => {
        e.preventDefault();
        props.setLoadingState(true);

        firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(async (fb_auth) => {
                            console.log(fb_auth);
                            props.setLoadingState(false);
                        })
                        .catch((error) => {
                            console.error("Incorrect email or password");
                        });
    }

    if (props.isLoggedIn) {
        return <Redirect to={props.successRoute} />;
    }

    return (
        <div className="page-body">
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter Email"/>
                    <Form.Control type="password" required value={password} onChange={e => setpassword(e.target.value)} placeholder="Enter Current Password"/>
                </Form.Group>
                <br />
                <Button as={Link} to="/" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Login</Button>
            </Form>
        </div>
    );
}

export default Login;