import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";

export default class CreateCustomer extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        // this.onChangeEmail = this.onChangeEmail.bind(this);
        // this.onChangeFirstName = this.onChangeFirstName.bind(this);
        // this.onChangeLastName = this.onChangeLastName.bind(this);
        // this.onChangeAccess = this.onChangeAccess.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            // email: '',
            // firstName: '',
            // lastName: '',
            // accessLevel: ''
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }
    // onChangeEmail(e) {
    //     this.setState({
    //         email: e.target.value
    //     });
    // }
    // onChangeFirstName(e) {
    //     this.setState({
    //         firstName: e.target.value
    //     });
    // }
    // onChangeLastName(e) {
    //     this.setState({
    //         lastName: e.target.value
    //     });
    // }
    // onChangeAccess(e) {
    //     this.setState({
    //         accessLevel: e.target.value
    //     });
    // }

    onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password,
            // email: this.state.email,
            // firstName: this.state.firstName,
            // lastName: this.state.lastName,
            // accessLevel: this.state.accessLevel
        }
        console.log(user);
        axios.post(deployment.localhost + "/users/add", user)
            .then(res => console.log(res.data));

        this.setState({
            username: '',
            password: '',
            // email: '',
            // firstName: '',
            // lastName: '',
            // accessLevel: ''
        })
    }

    render() {
        return (
            <div>
                <h6>Add User</h6>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" required value={this.state.username} onChange={this.onChangeUsername} placeholder="Enter Username"/>
                        {/* <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={this.state.firstName} onChange={this.onChangeFirstName} placeholder="Enter First Name"/>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={this.state.lastName} onChange={this.onChangeLastName} placeholder="Enter Last Name"/>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} placeholder="Enter Email"/> */}
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" required value={this.state.password} onChange={this.onChangePassword} placeholder="Enter Password"/>
                        {/* <Form.Label>Access Level</Form.Label>
                        <Form.Control as="select" aria-label="Default select" value={this.state.accessLevel} onChange={this.onChangeAccess}>
                            <option>Standard</option>
                            <option>Administrator</option>
                        </Form.Control> */}
                    </Form.Group>
                    <Button as={Link} to="/admin/users" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Create</Button>
                </Form>
            </div>
        );
    }
}