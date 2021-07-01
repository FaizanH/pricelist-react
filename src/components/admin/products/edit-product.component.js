import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import deployment from "../../../deployment";
import { getProductById, updateProduct } from "../../../services/services";

const EditProduct = props => {
    const [sku, setsku] = useState("");
    const [active, setactive] = useState("");
    const [title, settitle] = useState("");
    const [price, setprice] = useState("");
    // Remainder need to be separated into components i.e. shipping

    const onSubmit = async e => {
        // Get state modifiers here to do loading when submit executes
        e.preventDefault();
        const product = {
            sku,
            active,
            title,
            price
        }
        let res = await updateProduct(props.match.params.id, product);
        if (res) {
            console.log(res);
            window.location = "/admin/products";
        }
    }

    useEffect(() => {
            async function fetchData() {
                let res = await getProductById(props.match.params.id);

                if (res) {
                    console.log(res);
                    setsku(res.sku);
                    setactive(res.active);
                    settitle(res.title);
                    setprice(res.price);
                }
            }
            fetchData();
    }, []);

    return (
        <div>
            <h1>Edit Product</h1>
            <Form onSubmit={onSubmit} className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control type="text" required value={sku} onChange={e => setsku(e.target.value)} placeholder=""/>
                <Form.Label>Active</Form.Label>
                <Form.Control type="text" required value={active} onChange={e => setactive(e.target.value)} placeholder=""/>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required value={title} onChange={e => settitle(e.target.value)} placeholder=""/>
                <Form.Label>Price</Form.Label>
                <Form.Control type="text" required value={price} onChange={e => setprice(e.target.value)} placeholder=""/>
                <Button as={Link} to="/admin/products" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Save</Button>
            </Form>
        </div>
    );
}

export default EditProduct;