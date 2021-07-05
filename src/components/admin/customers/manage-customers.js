import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";
import axios from "axios";
import { deleteCustomer } from "../../../services/services";
import deployment from "../../../deployment";

const Customer = props => (
    <tr>
        <td>{props.customer.name}</td>
        <td>{props.customer.email}</td>
        <td>
            <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> |
            <a href="#" onClick={() => { props.delCustomer(props.customer._id) }}>delete</a>
        </td>
    </tr>
);

export default class ManageCustomers extends Component {
    constructor(props) {
        super(props);

        this.delCustomer = this.delCustomer.bind(this);

        this.state = { customers: [] };
    }

    componentDidMount() {
        axios.get(deployment.localhost + "/customers")
            .then(res => {
                this.setState({ customers: res.data })
            })
            .catch(err => console.log(err));
    }

    async delCustomer(id) {
        axios.delete(deployment.localhost + "/customers/" + id)
            .then(res => console.log(res.data));

        let res = await deleteCustomer(id);
        if (res) {
            this.setState({
                customers: this.state.customers.filter(el => el._id !== id)
            });
        }
    }

    customersList() {
        return this.state.customers.map(current => {
            return <Customer customer={current} delCustomer={this.delCustomer} key={current._id} />;
        });
    }

    render() {
        return (
            <div>
                <h3>Manage Customers</h3>
                <Button as={Link} to="/admin/create-customer" variant="primary" type="submit">Add Customer</Button>
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