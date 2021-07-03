import React, { Component, useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../../services/services";
import deployment from "../../../deployment";

import { parse } from "papaparse";

const AddProduct = props => {
    const [pricing, setPricing] = useState([]);
    const [sku, setSku] = useState("");
    const [title, setTitle] = useState("");
    const [importDone, setImportDone] = useState(false);
    const [Customer, setCustomerName] = useState("");
    const [Price, setCustomerPrice] = useState("");

    let _isMounted = false;

    useEffect(() => {
        _isMounted = true;
        return () => { _isMounted = false };
    }, [pricing]);

    const deleteCustomerPrice = Customer => {
        setPricing(pricing.filter(el => el.Customer !== Customer));
    }

    const CustomerPrices = props => (
        <tr>
            <td>{props.customer.Customer}</td>
            <td>{props.customer.Price}</td>
            <td>
                {/* <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> | */}
                <a href="#" onClick={() => { props.deleteCustomerPrice(props.customer.Customer) }}>delete</a>
            </td>
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
        if (!importDone && pricing.length == 0) {
            return <DragNDropElement />
        } else {
            return pricing.map(currentcustomer => {
                return <CustomerPrices customer={currentcustomer} deleteCustomerPrice={deleteCustomerPrice} key={pricing.indexOf(currentcustomer)} />;
            });
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        const product = {
            sku,
            title,
            pricing
        }
        // axios.post(deployment.localhost + "/products/add", product)
        // .then(res => {
        //     console.log(res.data);
        //     window.location = "/admin/products";
        // });
        let res = await createProduct(product);
        if (res) {
            window.location = "/admin/products";
        }
    }

    const addCustomerPrice = e => {
        e.preventDefault();
        let p = parseInt(Price);
        let data = { Customer, "Price": p };
        // Append to state
        setPricing(prev => [...prev, data]);
    }

    return (
        <div>
            <h6>Create New Product</h6>
            <Form id="submit-new-product" onSubmit={ onSubmit } className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" required value={sku} onChange={e => setSku(e.target.value)} placeholder=""/>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}  placeholder=""/>
                <br/>
                <Form.Label>Add New Customer Price</Form.Label>
                <Form.Control type="text" value={Customer} onChange={e => setCustomerName(e.target.value)} placeholder="Enter Customer Name"/>
                <Form.Control type="text" value={Price} onChange={e => setCustomerPrice(e.target.value)} placeholder="Enter Price"/>
                <Button onClick={ addCustomerPrice }>Add</Button>
                <br/><br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Price</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        { pricingTable() }
                    </tbody>
                </Table>
                <Button onClick={() => setPricing([])}>Clear</Button>
                <br/><br/>
                <Button as={Link} to="/admin/products" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Create</Button>
            </Form>
        </div>
    );
}

export default AddProduct;