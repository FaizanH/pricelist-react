import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getProducts } from "../../../services/services";
import { findAllByTestId } from "@testing-library/react";

let _isMounted = false;
// let needsRefresh = false;

const ManageProducts = props => {
    const [products, setProducts] = useState([]);
    const [customer, setCustomer] = useState({Customer: "Test Name", Price: 199});
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        _isMounted = true;
        if (update || products.length === 0)
            fetchData();
        return () => { _isMounted = false };
    }, [update]);

    const fetchData = async e => {
        let res = await getProducts();
        if (res) {
            setProducts(res);
            setUpdate(false);
        }
    }

    const deleteProduct = async(id) => {
        axios.delete(deployment.localhost + "/products//" + id)
            .then(res => {
                console.log(res.data)
                setUpdate(true);
            });
    }

    const searchProducts = e => {
        // Find customer from form
        e.preventDefault();
        console.log("press me!")
    }

    const Product = props => (
        <tr>
            <td>{props.product.sku}</td>
            <td>{props.product.title}</td>
            <td>
                <Link to={"/admin/products/edit/" + props.product._id}>edit</Link> |
                <a href="#" onClick={() => { props.deleteProduct(props.product._id) }}> delete</a>
            </td>
        </tr>
    )

    const productsList = e => {
        if (products != "") {
            return products.map(currentproduct => {
                return <Product product={currentproduct} deleteProduct={deleteProduct} key={currentproduct._id} />;
            });
        }
    }

    return (
        <div>
            <p>Product Management Page</p>
            <Button as={Link} to="/admin/add-product" variant="primary" type="submit">Add Product</Button>
            <br/><br/>
            <Form onSubmit={searchProducts} className="w-50">
                <InputGroup className="mb-3">
                    <FormControl
                    type="text"
                    placeholder="Product Name"
                    // onChange={e => setCustomer(e.target.value)}
                    // value={customer.Customer}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" type="submit">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Title</th>
                        <th>Modify</th>
                    </tr>
                </thead>
                <tbody>
                    { productsList() }
                </tbody>
            </Table>
        </div>
    );
}

export default ManageProducts;