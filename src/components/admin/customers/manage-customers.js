import React, { Component, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, InputGroup, FormControl, Pagination } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";
import { getCustomers, updatePrice, deletePrice, deleteCustomer } from "../../../services/services";

let _isMounted = false;
let startMidPages = 2;
let endMidPages = 2;
let customersPerPage = 10;

// Refactor all methods to update price schema instead of products - remove pricing array from products

const ManageCustomers = props => {
    const [customers, setCustomers] = useState([]);
    // const [customer, setCustomer] = useState({});
    const [update, setUpdate] = useState(false);
    const [page, setPage] = useState(1);
    const [queryString, setQueryString] = useState("");
    const [custQuery, setCustQuery] = useState("");
    const lenArr = [];
    // let updatedPrices = [];
    // const [updateBtn, setUpdateBtn] = useState(true);

    useEffect(() => {
        _isMounted = true;
        if (update || customers.length === 0) {
            fetchData(page, customersPerPage);
        }

        return () => { _isMounted = false };
    }, [update]);

    const fetchData = async (page, limit) => {
        let res = await getCustomers(page, limit, queryString, custQuery);
        if (res) {
            setCustomers(res);
            endMidPages = res.total;
            setUpdate(false);
        }
    }

    // const deletePrices = async(e, id) => {
    //     e.stopPropagation();
    //     let res = await deletePrice(id);
    //     if (res) {
    //         setUpdate(true);
    //     }
    //     // axios.delete(deployment.localhost + "/products/prices/" + prodid + "/" + Customer)
    //     //     .then(res => {
    //     //         console.log(res.data)
    //     //         setUpdate(true);
    //     //     });
    // }

    const delCustomer = async(e, id) => {
        e.preventDefault();
        let res = await deleteCustomer(id);
        if (res) {
            this.setState({
                customers: this.state.customers.filter(el => el._id !== id)
            });
        }
    }

    const searchCustomer = e => {
        e.preventDefault();
        setUpdate(true);
    }

    const prevPage = e => {
        e.preventDefault();
        if (customers.prev) {
            setPage(customers.prev.page);
            setUpdate(true);
        }
    }

    const nextPage = e => {
        e.preventDefault();
        if (customers.next) {
            setPage(customers.next.page);
            setUpdate(true);
        }
    }

    const goToPage = (e, p) => {
        e.preventDefault();
        if (p <= customers.total) {
            setPage(p);
            setUpdate(true);
        }
    }

    const checkPagination = e => {
        if (customers) {
            if (customers.total > 10) {
                // startMidPages = Math.ceil(products.total / 2);
                endMidPages = startMidPages + 3;
                if (endMidPages >= customers.total) {
                    endMidPages = customers.total - 1;
                    startMidPages = endMidPages - 4;
                }
            } else {
                endMidPages = customers.total;
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
        if (endMidPages < customers.total - 1) {
            startMidPages = startMidPages + 4;
            setUpdate(true);
        }
    }

    const listPages = e => {
        if (customers && customers.total > 1) {
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

            {(customers.total > 10 && startMidPages > 2) ? <Pagination.Ellipsis onClick={e => rotateMidPagesBackwards(e)}/> : null}

            { listPages() }

            {(customers.total > 10 && endMidPages < customers.total - 1) ? <Pagination.Ellipsis onClick={e => rotateMidPagesForward(e)} /> : null}
            {customers.total > 10 ? <Pagination.Item key={customers.total+"-lastpg"} active={page === customers.total} onClick={ e => goToPage(e, customers.total) }>{customers.total}</Pagination.Item> : null}
            <Pagination.Next key={"next"} onClick={ e => nextPage(e) } />
        </Pagination>
    )

    const Customer = props => (
        <tr>
            <td>{props.customer.name}</td>
            <td>{props.customer.email}</td>
            <td>
                <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> |
                <a href="javascript:void(0);" onClick={(e) => { props.delCustomer(e, props.customer._id) }}>delete</a>
            </td>
        </tr>
    );

    const customersList = e => {
        if (customers != "") {
            return customers.results.map(current => {
                return <Customer customer={current} delCustomer={delCustomer} key={current._id} />;
            });
        }
    }

    return (
        <div>
            <p>Manage Customers</p>
            <Button as={Link} to="/admin/create-customer" variant="primary" type="submit">Add Customer</Button>
            <br/>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    { customersList() }
                </tbody>
            </Table>
            { pageNavigation() }
            <br/>
            <Button as={Link} to="/admin/import-pricing" variant="primary" type="submit">Import Customers</Button>
        </div>
    );
}

export default ManageCustomers;