import React, { Component, useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import { getProductById, updateProduct } from "../../../services/services";
import { parse } from "papaparse";

const EditProduct = props => {
    let _isMounted = false;

    const [sku, setsku] = useState("");
    const [active, setactive] = useState("");
    const [title, settitle] = useState("");
    const [pricing, setPricing] = useState([]);
    const [importDone, setImportDone] = useState(false);
    const [Customer, setCustomerName] = useState("");
    const [Price, setCustomerPrice] = useState(0);
    // Remainder need to be separated into components i.e. shipping

    useEffect(() => {
        _isMounted = true;
        async function fetchData() {
            let res = await getProductById(props.match.params.id);

            if (res) {
                setsku(res.sku);
                setactive(res.active);
                settitle(res.title);
                setPricing(res.pricing);
            }
        }
        fetchData();
        return () => { _isMounted = false };
    }, []);

    const onSubmit = async e => {
        // Get state modifiers here to do loading when submit executes
        e.preventDefault();
        const product = {
            sku,
            active,
            title,
            pricing
        }
        console.log(pricing);
        console.log(product);
        let res = await updateProduct(props.match.params.id, product);
        if (res) {
            console.log(res);
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
                        const customerPrices = await e.dataTransfer.files[0].text();
                        const res = parse(customerPrices, { header: true });
                        console.log(res.data);
                        setPricing(res.data);
                        setImportDone(true);
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
                {/* <Form.Label>Active</Form.Label>
                <Form.Control type="text" required value={active} onChange={e => setactive(e.target.value)} placeholder=""/> */}
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required value={title} onChange={e => settitle(e.target.value)} placeholder=""/>
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
                <Button variant="primary" type="submit">Save</Button>
            </Form>
        </div>
    );
}

export default EditProduct;