import React, { Component, useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Select from 'react-select'
import { Link } from "react-router-dom";
import axios from "axios";
import { createProduct, getCustomers, createPrice, deletePrice } from "../../../services/services";
import deployment from "../../../deployment";

import { parse } from "papaparse";

const AddProduct = props => {
    const [pricing, setPricing] = useState([]);
    const [sku, setSku] = useState("");
    const [title, setTitle] = useState("");
    const [importDone, setImportDone] = useState(false);
    const [Customer, setCustomerName] = useState("");
    const [Price, setCustomerPrice] = useState("");
    const [customers, setCustomers] = useState([]);

    let _isMounted = false;

    useEffect(() => {
        _isMounted = true;
        async function fetchData() {
            let customers = await getCustomers(1, 1000, "", "");
            if (customers) {
                setCustomers([]);
                customers.results.map(currentCustomer => {
                    let mapCust = {
                        value: currentCustomer._id,
                        label: currentCustomer.name
                    }
                    setCustomers(prev => [...prev, mapCust]);
                });
            }
        }
        fetchData();
        return () => { _isMounted = false };
    }, [pricing]);

    const deleteCustomerPrice = async (e, Customer) => {
        e.preventDefault();
        e.stopPropagation();
        let res = await deletePrice(sku, Customer);
        if (res.status !== 400) {
            setPricing(pricing.filter(el => el.Customer !== Customer));
            console.log(res)
        }
    }

    const CustomerPrices = props => (
        <tr>
            <td>{props.customer.Customer}</td>
            <td>{props.customer.Price}</td>
            <td>
                {/* <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> | */}
                <a href="javascript:void(0)" onClick={(e) => {props.deleteCustomerPrice(e, props.customer.Customer) }}>delete</a>
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
                        if (e.dataTransfer.files[0].type === "text/csv" || e.dataTransfer.files[0].type === "application/vnd.ms-excel") {
                            const customerPrices = await e.dataTransfer.files[0].text();
                            const res = parse(customerPrices, { header: true });
                            setPricing(res.data);
                            setImportDone(true);
                        } else {
                            console.log("Error: File type does not match text/csv")
                        }
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
        let res = await createProduct(product);
        if (res) {
            window.location = "/admin/products";
        }
    }

    const addCustomerPrice = async e => {
        e.preventDefault();
        let data = { Customer, Price };
        let product = {
            sku,
            title,
            Customer,
            Price
        }
        // Append to state
        let res = await createPrice(product);

        if (res.Message !== "Duplicate Found, skipping") {
            setPricing(prev => [...prev, data]);
            console.log(res);
        }
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
                <Form.Label>Add New Customer Price</Form.Label>&emsp;
                <Button target={"_blank"} as={Link} to={"/admin/create-customer"}>New Customer</Button>
                <Select options={customers} onChange={e => setCustomerName(e.label)} placeholder="Select Customer" />
                <Form.Control type="text" value={Price} onChange={e => setCustomerPrice(e.target.value)} placeholder="Enter Price"/>
                <Button onClick={ addCustomerPrice }>Add Price</Button>
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