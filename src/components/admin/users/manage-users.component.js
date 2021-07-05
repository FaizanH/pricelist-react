import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { deleteUser } from "../../../services/services";

const User = props => (
    <tr>
        <td>{props.user.username}</td>
        <td>{props.user.first_name} {props.user.last_name}</td>
        <td>{props.user.permission_group}</td>
        <td>
            <Link to={"/admin/users/edit/" + props.user._id}>edit</Link> |
            <a href="#" onClick={() => { props.deleteUser(props.user._id) }}>delete</a>
        </td>
    </tr>
);

export default class ManageUsers extends Component {
    constructor(props) {
        super(props);

        this.deleteUser = this.deleteUser.bind(this);

        this.state = { users: [] };
    }

    componentDidMount() {
        axios.get(deployment.localhost + "/users/")
            .then(res => {
                this.setState({ users: res.data })
            })
            .catch(err => console.log(err));
    }

    deleteUser(id) {
        deleteUser(id)
        this.setState({
            users: this.state.users.filter(el => el._id !== id)
        });
    }

    usersList() {
        return this.state.users.map(currentuser => {
            return <User user={currentuser} deleteUser={this.deleteUser} key={currentuser._id} />;
        });
    }

    render() {
        return (
            <div>
                <h3>Manage Users</h3>
                <Button as={Link} to="/admin/create-user" variant="primary" type="submit">Add User</Button>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.usersList() }
                    </tbody>
                </Table>
            </div>
        );
    }
}