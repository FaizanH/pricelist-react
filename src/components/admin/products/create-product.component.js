import React, { Component, useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import { parse } from "papaparse";

const AddProduct = props => {
    const [pricing, setPricing] = useState([]);
    const [sku, setSku] = useState("");
    const [title, setTitle] = useState("");
    const [importDone, setImportDone] = useState(false);
    let _isMounted = false;

    useEffect(() => {
        _isMounted = true;

        return () => { _isMounted = false };
    }, [setImportDone]);

    const onSubmit = e => {
        e.preventDefault();
        const product = {
            sku,
            title,
            pricing
        }
        axios.post(deployment.localhost + "/products/add", product)
        .then(res => {
            console.log(res.data);
            window.location = "/admin/products";
        });
    }

    const deleteCustomer = e => {

    }

    const CustomerPrices = props => (
        <tr>
            <td>{props.customer.Customer}</td>
            <td>{props.customer.Price}</td>
            {/* <td>
                <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> |
                <a href="#" onClick={() => { props.deleteCustomer(props.customer._id) }}>delete</a>
            </td> */}
        </tr>
    );

    const DragNDropElement = props => (
        <tr>
            <td colSpan={"100%"}>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        const customerPrices = await e.dataTransfer.files[0].text();
                        const res = parse(customerPrices, { header: true });
                        setPricing(res.data);
                        setImportDone(true);
                    }}
                >
                    Drag CSV to import Customer Pricing
                </div>
            </td>
        </tr>
    );

    const pricingTable = e => {
        if (!importDone) {
            return <DragNDropElement />
        } else {
            return pricing.map(currentcustomer => {
                return <CustomerPrices customer={currentcustomer} deleteCustomer={deleteCustomer} key={pricing.indexOf(currentcustomer)} />;
            });
        }
    }

    return (
        <div>
            <h6>Create New Product</h6>
            <Form onSubmit={ onSubmit } className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" required value={sku} onChange={e => setSku(e.target.value)} placeholder=""/>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}  placeholder=""/>
                <br/>
                <Form.Label>Pricing</Form.Label>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Price</th>
                            {/* <th>Modify</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        { pricingTable() }
                    </tbody>
                </Table>

                <Button as={Link} to="/admin/products" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Create</Button>
            </Form>
        </div>
    );
}

export default AddProduct;