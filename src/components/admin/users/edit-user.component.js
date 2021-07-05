import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import Select from "react-select";
import firebase from "../../../firebase";
import { getUserById, updateUser } from "../../../services/services";

const permissions_options = [
    {label: "Standard User", value: 0},
    {label: "Administrator", value: 1}
]

export default class EditUser extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            email_address: '',
            currentPassword: '',
            newPassword: '',
            permission_group: {},
            loading: true
        }
    }

    componentDidMount() {
        const fetchData = async e => {
            let res = await getUserById(this.props.match.params.id);
            if (res) {
                this.setState({
                    username: res.username,
                    email_address: res.email_address,
                    permission_group: {
                        label: res.permission_group,
                        value: 1
                    },
                    loading: false
                });
            }
        }
        fetchData();
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

    onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            email_address: this.state.email_address,
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword,
            permission_group: this.state.permission_group
        }
        console.log(user);
        const runUpdate = async e => {
            let res = await updateUser(this.props.match.params.id, user);
            if (res) {
                console.log(res);
                this.setState({
                    currentPassword: '',
                    newPassword: '',
                });
            }
        }
        runUpdate();
    }

    setPermissions(e) {
        this.setState({
            permission_group: e.label
        })
    }

    sendResetEmail(e, email_address) {
        e.preventDefault();
        firebase.auth().sendPasswordResetEmail(email_address);
    }

    render() {
        return (
            <div>
                <h6>Edit User</h6>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" required value={this.state.username} onChange={this.onChangeUsername} placeholder="Enter Username"/>
                        <Form.Label>Permission Group</Form.Label>
                        { !this.state.loading ? <Select options={permissions_options} defaultValue={this.state.permission_group} onChange={e => this.setPermissions(e)} /> : null }
                        <br/>
                        <Button variant="primary" onClick={e => this.sendResetEmail(e, this.state.email_address) }>Reset Password via Email</Button>
                    </Form.Group>
                    <Button as={Link} to="/admin/users" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </Form>
            </div>
        );
    }
}