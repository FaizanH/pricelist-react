import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getProducts } from "../../../services/services";

let _isMounted = false;

const ManageProducts = props => {
    const [products, setProducts] = useState("");
    const [customer, setCustomer] = useState({Customer: "Test Name", Price: 199});

    useEffect(() => {
        _isMounted = true;
        fetchData();

        return () => { _isMounted = false };
    }, []);

    const fetchData = async e => {
        if (_isMounted) {
            let res = await getProducts();
            if (res) {
                setProducts(res);
            }
        }
    }

    const deleteProduct = async(id) => {
        axios.delete(deployment.localhost + "/products/" + id)
            .then(res => console.log(res.data));
        setProducts(products.filter(el => el._id !== id))
    }

    const getPricing = e => {
        // api get for customer query by name
        // set products state to new data
        return (
            "Some customer's pricing"
        );
    }

    const searchCustomer = e => {
        // Find customer from form
        e.preventDefault();
        console.log("press me!")
    }

    const Product = props => (
        <tr>
            <td>{customer.Customer}</td>
            <td>{props.product.sku}</td>
            <td>{props.product.active.toString()}</td>
            <td>{props.product.title}</td>
            <td>{ getPricing() }</td>
            <td>
                <Link to={"/admin/products/edit/" + props.product._id}>edit</Link> |
                <a href="#" onClick={() => { props.deleteProduct(props.product._id) }}>delete</a>
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
            <p>Products List Page</p>
            <Button as={Link} to="/admin/add-product" variant="primary" type="submit">Add Product</Button>
            <br/><br/>
            <Form onSubmit={searchCustomer} className="w-50">
                <InputGroup className="mb-3">
                    <FormControl
                    type="text"
                    placeholder="Customer"
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
                        <th>Active</th>
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

export default ManageProducts;

// No state or lifecycles (Functional component)
// const Product = props => (
//     <tr>
//         <td>{props.product.sku}</td>
//         <td>{props.product.active.toString()}</td>
//         <td>{props.product.title}</td>
//         { this.getCustomer() }
//         <td>
//             <Link to={"/admin/products/edit/" + props.product._id}>edit</Link> |
//             <a href="#" onClick={() => { props.deleteProduct(props.product._id) }}>delete</a>
//         </td>
//     </tr>
// )

// // Class component
// export default class ManageProducts extends Component {
//     constructor(props) {
//         super(props);

//         this.deleteProduct = this.deleteProduct.bind(this);
//         this.state = { products: [] };
//     }

//     fetchData = async e => {
//         let res = await getProducts();
//         console.log(res);
//         if (res) {
//             this.setState({ products: res })
//         }
//     }

//     // Get List of Products
//     componentDidMount() {
//         this.fetchData();
//     }

//     deleteProduct(id) {
//         axios.delete(deployment.localhost + "/products/" + id)
//             .then(res => console.log(res.data));

//         this.setState({
//             products: this.state.products.filter(el => el._id !== id) //_id refers to db collection id
//         });
//     }

//     getCustomer() {
//         return [
//             <td key="0">
//                 Hi
//             </td>,
//             <td key="1">
//                 There
//             </td>
//         ]
//     }

//     productsList() {
//         return this.state.products.map(currentproduct => {
//             return <Product product={currentproduct} deleteProduct={this.deleteProduct} key={currentproduct._id} />;
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <p>Products List Page</p>
//                 <Button as={Link} to="/admin/add-product" variant="primary" type="submit">Add Product</Button>
//                 <br/>
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>SKU</th>
//                             <th>Active</th>
//                             <th>Title</th>
//                             <th>Price</th>
//                             <th>Modify</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         { this.productsList() }
//                     </tbody>
//                 </Table>
//             </div>
//         );
//     }
// }