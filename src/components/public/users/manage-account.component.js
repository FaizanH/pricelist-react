import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";

export default class ManageAccount extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        // this.onChangeEmail = this.onChangeEmail.bind(this);
        // this.onChangeFirstName = this.onChangeFirstName.bind(this);
        // this.onChangeLastName = this.onChangeLastName.bind(this);
        // this.onChangeAccess = this.onChangeAccess.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            currentPassword: '',
            newPassword: '',
            // email: '',
            // firstName: '',
            // lastName: '',
            // accessLevel: ''
        }
    }

    componentDidMount() {
        axios.get(deployment.localhost + "/users/" + this.props.match.params.id)
            .then(res => {
                this.setState({
                    username: res.data.username
                });
            })
            .catch(err => console.log(err));
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }
    onChangeCurrentPassword(e) {
        this.setState({
            currentPassword: e.target.value
        });
    }
    onChangeNewPassword(e) {
        this.setState({
            newPassword: e.target.value
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
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword,
            // email: this.state.email,
            // firstName: this.state.firstName,
            // lastName: this.state.lastName,
            // accessLevel: this.state.accessLevel
        }
        console.log(user);
        axios.post(deployment.localhost + "/users/changePassword/" + this.props.match.params.id, user)
            .then(res => console.log(res.data));

        this.setState({
            username: '',
            currentPassword: '',
            newPassword: '',
            // email: '',
            // firstName: '',
            // lastName: '',
            // accessLevel: ''
        })
    }

    render() {
        return (
            <div>
                <h6>Manage Account</h6>
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
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" required value={this.state.currentPassword} onChange={this.onChangeCurrentPassword} placeholder="Enter Current Password"/>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" required value={this.state.newPassword} onChange={this.onChangeNewPassword} placeholder="Enter New Password"/>
                        {/* <Form.Label>Access Level</Form.Label>
                        <Form.Control as="select" aria-label="Default select" value={this.state.accessLevel} onChange={this.onChangeAccess}>
                            <option>Standard</option>
                            <option>Administrator</option>
                        </Form.Control> */}
                    </Form.Group>
                    <Button as={Link} to="/admin/users" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </Form>
            </div>
        );
    }
}