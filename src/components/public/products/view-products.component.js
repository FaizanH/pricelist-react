import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getProducts } from "../../../services/services";

// No state or lifecycles (Functional component)
const Product = props => (
    <tr>
        <td>{props.product.sku}</td>
        <td>{props.product.active.toString()}</td>
        <td>{props.product.title}</td>
        <td>{props.product.price}</td>
    </tr>
)

// Class component
export default class ManageProducts extends Component {
    constructor(props) {
        super(props);

        this.fetchData = this.fetchData.bind(this);
        this.state = { products: [] };
    }

    fetchData = async e => {
        let res = await getProducts();
        console.log(res);
        if (res) {
            this.setState({ products: res })
        }
    }

    // Get List of Products
    componentDidMount() {
        this.fetchData();
    }

    productsList() {
        return this.state.products.map(currentproduct => {
            return <Product product={currentproduct} deleteProduct={this.deleteProduct} key={currentproduct._id} />;
        });
    }

    render() {
        return (
            <div>
                <p>Catalogue</p>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Active</th>
                            <th>Title</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.productsList() }
                    </tbody>
                </Table>
            </div>
        );
    }
}