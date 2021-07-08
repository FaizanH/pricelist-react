import React, { Component, useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Select from 'react-select'
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import { getCustomers, getProductById, getProductBySku, updateProduct, createPrice, deletePrice, getPricesBySku } from "../../../services/services";
import { parse } from "papaparse";
import queryString from 'query-string';

const EditProduct = props => {
    let _isMounted = false;

    const [sku, setsku] = useState("");
    const [active, setactive] = useState("");
    const [title, settitle] = useState("");
    const [pricing, setPricing] = useState([]);
    const [importDone, setImportDone] = useState(false);
    const [Customer, setCustomerName] = useState("");
    const [Price, setCustomerPrice] = useState(0);
    const [customers, setCustomers] = useState([]);
    // Remainder need to be separated into components i.e. shipping

    useEffect(() => {
        _isMounted = true;
        async function fetchData() {
            let params = queryString.parse(props.location.search);
            let res = await getProductBySku(params.sku);
            let customers = await getCustomers(1, 1000, "", "");

                console.log(customers)

            if (res) {
                setsku(res.sku);
                setactive(res.active);
                settitle(res.title);

                let prices = await getPricesBySku(res.sku);
                setPricing(prices);

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
        }
        fetchData();
        return () => { _isMounted = false };
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        const product = {
            sku,
            active,
            title
        }

        let res = await updateProduct(product);
        if (res) {
            console.log(res);
            window.location = "/admin/products";
        }
        // import pricing
    }

    const addCustomerPrice = async e => {
        e.preventDefault();

        let data = {sku, Customer, Price };
        let product = {
            sku,
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

    const deleteCustomerPrice = async (e, Customer) => {
        e.preventDefault();
        e.stopPropagation();
        // delete price from pricing
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

    const pricingTable = e => {
        if (!importDone && pricing.length == 0) {
            return <DragNDropElement />
        } else {
            return pricing.map(currentcustomer => {
                return <CustomerPrices customer={currentcustomer} deleteCustomerPrice={deleteCustomerPrice} key={pricing.indexOf(currentcustomer)} />;
            });
        }
    }

    const DragNDropElement = props => (
        <tr>
            <td colSpan={"100%"}>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        console.log(e.dataTransfer.files[0]);
                        if (e.dataTransfer.files[0].type === "text/csv" || e.dataTransfer.files[0].type === "application/vnd.ms-excel") {
                            const customerPrices = await e.dataTransfer.files[0].text();
                            const res = parse(customerPrices, { header: true });
                            console.log(res.data);
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

    return (
        <div>
            <h1>Edit Product</h1>
            <Form onSubmit={onSubmit} className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" required value={sku} onChange={e => setsku(e.target.value)} placeholder=""/>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required value={title} onChange={e => settitle(e.target.value)} placeholder=""/>
                <br/>
                <Form.Label>Add New Customer Price</Form.Label>
                <Select options={customers} onChange={e => setCustomerName(e.label)} placeholder="Select Customer" />
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
                <Button variant="primary" type="submit">Save</Button>
            </Form>
        </div>
    );
}

export default EditProduct;