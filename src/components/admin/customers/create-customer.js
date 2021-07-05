import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";

export default class CreateCustomer extends Component {
    constructor(props) {
        super(props);

        this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: ''
        }
    }

    onChangeCustomerName(e) {
        this.setState({
            name: e.target.value
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
            name: this.state.name,
            email: this.state.email
        }
        console.log(customer);
        axios.post(deployment.localhost + "/customers/add", customer)
            .then(res => console.log(res.data));

        this.setState({
            name: '',
            email: ''
        });
        window.location = "/admin/customers";
    }

    render() {
        return (
            <div>
                <h6>Add Customer</h6>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" required value={this.state.name} onChange={this.onChangeCustomerName} placeholder="Customer Name"/>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" required value={this.state.email} onChange={this.onChangeEmail} placeholder="Email Address"/>
                    </Form.Group>
                    <Button as={Link} to="/admin/customers" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Create</Button>
                </Form>
            </div>
        );
    }
}