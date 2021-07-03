import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";

const Customer = props => (
    <tr>
        <td>{props.user.username}</td>
        <td>{props.user.first_name} {props.user.last_name}</td>
        <td>{props.user.status}</td>
        <td>
            <Link to={"/admin/customers/edit/" + props.user._id}>edit</Link> |
            <a href="#" onClick={() => { props.deleteUser(props.user._id) }}>delete</a>
        </td>
    </tr>
);

export default class ManageCustomers extends Component {
    constructor(props) {
        super(props);

        this.deleteCustomer = this.deleteCustomer.bind(this);

        this.state = { customers: [] };
    }

    componentDidMount() {
        axios.get(deployment.localhost + "/customers")
            .then(res => {
                this.setState({ customers: res.data })
            })
            .catch(err => console.log(err));
    }

    deleteCustomer(id) {
        axios.delete(deployment.localhost + "/customers/" + id)
            .then(res => console.log(res.data));

        this.setState({
            customers: this.state.customers.filter(el => el._id !== id)
        });
    }

    customersList() {
        return this.state.customers.map(current => {
            return <Customer customer={current} deleteCustomer={this.deleteCustomer} key={current._id} />;
        });
    }

    render() {
        return (
            <div>
                <h3>Manage Customers</h3>
                <Button as={Link} to="/admin/create-user" variant="primary" type="submit">Add Customer</Button>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.customersList() }
                    </tbody>
                </Table>
            </div>
        );
    }
}