import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";

export default class EditCustomer extends Component {
    constructor(props) {
        super(props);

        this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            customerName: '',
            email: ''
        }
    }

    componentDidMount() {

    }

    onChangeCustomerName(e) {
        this.setState({
            customerName: e.target.value
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const customer = {
            customerName: this.state.customerName,
            email: this.state.email,
        }
        axios.post(deployment.localhost + "/users/changePassword/" + this.props.match.params.id, customer)
            .then(res => console.log(res.data));

        this.setState({
            customerName: '',
            email: ''
        })
    }

    render() {
        return (
            <div>
                <h6>Manage Customers</h6>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={this.state.firstName} onChange={this.onChangeFirstName} placeholder="Enter First Name"/>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} placeholder="Enter Email"/>
                    </Form.Group>
                    <Button as={Link} to="/admin/customers" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </Form>
            </div>
        );
    }
}