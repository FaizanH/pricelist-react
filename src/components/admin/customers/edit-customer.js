import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import { getCustomer, updateCustomer } from "../../../services/services";

export default class EditCustomer extends Component {
    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: ''
        }
    }

    componentDidMount() {
        const getUpdates = async e => {
            let res = await getCustomer(this.props.match.params.id);
            if (res)
                this.setState({
                    name: res.name,
                    email: res.email
                });
        }
        getUpdates();
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    async onSubmit(e) {
        e.preventDefault();
        const customer = {
            name: this.state.name,
            email: this.state.email,
        }
        let res = await updateCustomer(customer);
        if (res) {
            this.setState({
                name: '',
                email: ''
            })
            window.location = "/admin/customers";
        }
    }

    render() {
        return (
            <div>
                <h6>Manage Customers</h6>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={this.state.name} onChange={this.onChangeName} placeholder="Customer Name"/>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} placeholder="Email Address"/>
                    </Form.Group>
                    <Button as={Link} to="/admin/customers" variant="primary">Back</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </Form>
            </div>
        );
    }
}