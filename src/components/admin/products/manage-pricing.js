import React, { Component, useEffect, useState, useRef } from "react";
import { Table, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getProducts } from "../../../services/services";

let _isMounted = false;

const ManagePricing = props => {
    const [products, setProducts] = useState([]);
    // const [customer, setCustomer] = useState({});
    const [update, setUpdate] = useState(false);
    // let updatedPrices = [];
    // const [updateBtn, setUpdateBtn] = useState(true);

    useEffect(() => {
        _isMounted = true;
        if (update || products.length === 0) {
            fetchData();
        }

        return () => { _isMounted = false };
    }, [update]);

    const fetchData = async e => {
        let res = await getProducts();
        if (res) {
            setProducts(res);
            setUpdate(false);
        }
    }

    const deleteProduct = async(prodid, Customer) => {
        console.log(Customer);
        axios.delete(deployment.localhost + "/products/pricing/" + prodid + "/" + Customer)
            .then(res => {
                console.log(res.data)
                setUpdate(true);
            });
    }
    const updateProduct = async(prodid, Customer, Price) => {
        console.log(Customer);
        let payload = {
            prodid,
            Customer,
            Price
        }
        axios.post(deployment.localhost + "/products/pricing", payload)
            .then(res => {
                console.log(res.data)
                setUpdate(true);
            });
    }

    const searchCustomer = e => {
        // Find customer from form
        e.preventDefault();
        console.log("press me!")
    }

    const CustomerPrice = React.forwardRef((props, ref) => (
        <tr>
            <td>{props.customer.Customer}</td>
            <td>{props.product.sku}</td>
            <td>{props.product.title}</td>

            <td>
            <Form.Control
                type="text"
                placeholder="Price"
                defaultValue={props.customer.Price}
                disabled={false}
                // value={props.customer.Price}
                // onChange={e => setPriceHandler(e, props.customer.Customer)}
                ref={ref}
            />

            </td>
            <td key="events">
                <a href="#" onClick={() => { props.updateProduct(props.product._id, props.customer.Customer, ref.current.value) }}>update</a> |
                <a href="#" onClick={() => { props.deleteProduct(props.product._id, props.customer.Customer) }}> delete</a>
            </td>
        </tr>
    ));

    const productsList = e => {
        if (products != "") {
            return products.map(currentproduct => {
                return currentproduct.pricing.map(currentcustomer => {
                    return <CustomerPrice ref={React.createRef()} product={currentproduct} customer={currentcustomer} updateProduct={updateProduct} deleteProduct={deleteProduct} key={currentcustomer._id} />;
                })
            });
        }
    }

    return (
        <div>
            <p>Catalogue Management Page</p>
            <Form onSubmit={searchCustomer} className="w-50">
                <InputGroup className="mb-3">
                    <FormControl
                        type="text"
                        placeholder="Customer Name"
                        // onChange={e => setCustomer(e.target.value)}
                        // value={customer.Customer}
                    />
                    <FormControl
                        type="text"
                        placeholder="Product SKU"
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
                        <th>Customer</th>
                        <th>SKU</th>
                        <th>Title</th>
                        <th>Price</th>
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

export default ManagePricing;