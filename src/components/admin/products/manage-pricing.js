import React, { Component, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, InputGroup, FormControl, Pagination } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getProducts } from "../../../services/services";

let _isMounted = false;
let startMidPages = 2;
let endMidPages = 2;

const ManagePricing = props => {
    const [products, setProducts] = useState([]);
    // const [customer, setCustomer] = useState({});
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const lenArr = [];
    // let updatedPrices = [];
    // const [updateBtn, setUpdateBtn] = useState(true);

    useEffect(() => {
        _isMounted = true;
        if (update || products.length === 0) {
            fetchData(page, 5);
        }

        return () => { _isMounted = false };
    }, [update]);

    const fetchData = async (page, limit) => {
        let res = await getProducts(page, limit);
        if (res) {
            setProducts(res);
            endMidPages = res.total;
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
            <td><Link to={"/admin/products/edit/" + props.product._id}>{props.product.sku}</Link></td>
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
            return products.results.map(currentproduct => {
                return currentproduct.pricing.map(currentcustomer => {
                    return <CustomerPrice ref={React.createRef()} product={currentproduct} customer={currentcustomer} updateProduct={updateProduct} deleteProduct={deleteProduct} key={currentcustomer._id} />;
                });
            });
        }
    }

    const prevPage = e => {
        e.preventDefault();
        if (products.prev) {
            setPage(products.prev.page);
            setUpdate(true);
        }
    }

    const nextPage = e => {
        e.preventDefault();
        if (products.next) {
            setPage(products.next.page);
            setUpdate(true);
        }
    }

    const goToPage = (e, p) => {
        e.preventDefault();
        if (p <= products.total) {
            setPage(p);
            setUpdate(true);
        }
    }

    const checkPagination = e => {
        if (products) {
            if (products.total > 10) {
                // startMidPages = Math.ceil(products.total / 2);
                endMidPages = startMidPages + 3;
                if (endMidPages >= products.total) {
                    endMidPages = products.total - 1;
                    startMidPages = endMidPages - 4;
                }
            }
        }
    }

    const rotateMidPagesBackwards = e => {
        e.preventDefault();
        if (startMidPages > 2) {
            startMidPages = startMidPages - 4;
            // endMidPages = endMidPages - 3;
            setUpdate(true);
        }
    }

    const rotateMidPagesForward = e => {
        e.preventDefault();
        if (endMidPages < products.total - 1) {
            startMidPages = startMidPages + 4;
            setUpdate(true);
        }
    }

    const listPages = e => {
        if (products && products.total > 1) {
            for (let i = startMidPages; i <= endMidPages; i++) {
                lenArr.push(i);
            }
            return lenArr.map(p => {
                return (
                    <Pagination.Item onClick={ e => goToPage(e, p) } key={p} active={p === page}>{p}</Pagination.Item>
                )
            });
        }
    }

    const pageNavigation = e => (
        <Pagination>
            <Pagination.Prev key={"prev"} onClick={e => prevPage(e) } />
            <Pagination.Item key={1} active={page === 1} onClick={ e => goToPage(e, 1) }>{1}</Pagination.Item>
            { checkPagination() }

            {(products.total > 10 && startMidPages > 2) ? <Pagination.Ellipsis onClick={e => rotateMidPagesBackwards(e)}/> : null}

            { listPages() }

            {(products.total > 10 && endMidPages < products.total - 1) ? <Pagination.Ellipsis onClick={e => rotateMidPagesForward(e)} /> : null}
            {products.total > 10 ? <Pagination.Item key={products.total+"-lastpg"} active={page === products.total} onClick={ e => goToPage(e, products.total) }>{products.total}</Pagination.Item> : null}
            <Pagination.Next key={"next"} onClick={ e => nextPage(e) } />
        </Pagination>
    )

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
            { pageNavigation() }
        </div>
    );
}

export default ManagePricing;