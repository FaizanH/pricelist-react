import React, { Component, useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Select from 'react-select'
import { Link } from "react-router-dom";
import axios from "axios";
import { createProduct, getCustomers, createPrice, deletePrice, createCustomer, importPricing, importCustomers } from "../../../services/services";
import deployment from "../../../deployment";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { parse } from "papaparse";

const ImportPricing = props => {
    const [pricing, setPricing] = useState([]);
    const [importDone, setImportDone] = useState(false);
    const [customers, setCustomers] = useState([]);

    let _isMounted = false;

    useEffect(() => {
        _isMounted = true;
        
        return () => { _isMounted = false };
    }, [pricing]);

    const deleteCustomerPrice = async (e, sku, Customer) => {
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
            <td>{props.price.sku}</td>
            <td>{props.price.title}</td>
            <td>{props.price.Customer}</td>
            <td>{props.price.Price}</td>
            <td>
                {/* <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> | */}
                <a href="javascript:void(0)" onClick={(e) => {props.deleteCustomerPrice(e, props.price.sku, props.price.Customer) }}>delete</a>
            </td>
        </tr>
    );

    // const importPrice = async (element) => {
    //     Promise.resolve(createPrice(element));
    // }
    // const importCustomer = async (element) => {
    //     Promise.resolve(createCustomer(element));
    // }

    // const importCheck = async (type, element) => {
    //     if (type === "pricing") {
    //         return importPrice(element);
    //     }
    //     if (type === "customers") {
    //         return importCustomer(element);
    //     }
    // }

    // const doImport = async (type, array) => {
    //     return Promise.all( array.map(element => importCheck(type, element)) )
    // }

    const doImportPricingBulk = async (d) => {
        d = {
            data: d
        }
        console.log(d);
        let res = await importPricing(d);
        if (res) {
            console.log("Pricing Import Completed: ");
        }
    }

    const doImportCustomersBulk = async (d) => {
        d = {
            data: d
        }
        console.log(d);
        let res = await importCustomers(d);
        if (res) {
            console.log("Customer Import Completed: ");
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        doImportPricingBulk(pricing).then(() => {
            doImportCustomersBulk(customers).then(() => {
                console.log("All Imports Completed");
                                        // setTimeout(() => {
            //     window.location = "/admin/products";
            // }, 2500)
            })
        })
        console.log(customers);
    }

    // doImport("pricing", pricing).then(r => {
    //     doImport("customers", customers).then(t => {
    //         console.log("Import completed");
    //         // setTimeout(() => {
    //         //     window.location = "/admin/products";
    //         // }, 2500)
    //     })
    // })

    const buildProducts = async payload => {
        // Build products list
        let uniqueSkus = [];
        let uniqueCustomers = [];
        console.log(payload);
        payload.map(productline => {
            // if sku exists in products
            if (productline.sku !== "") {
                if (!uniqueSkus.includes(productline.sku)) {
                    // Not duplicate sku
                    uniqueSkus.push(productline.sku);
                    setPricing(prev => [...prev, productline]);

                    // Check for unique Customer Names
                    if (!uniqueCustomers.includes(productline.Customer)) {
                        uniqueCustomers.push(productline.Customer);
                        // Create customer
                        let newCustomer = {
                            name: productline.Customer,
                            email: "" // Empty email for imports
                        }
                        setCustomers(prev => [...prev, newCustomer])
                    }
                }
                else {
                    // Duplicate sku found. Only create price
                    setPricing(prev => [...prev, productline]);
                }
            }
        });
    }

    const DragNDropElement = props => (
        // <tr>
        //     <td colSpan={"100%"}>
                <div className="dragndrop"
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={async (e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0].type === "text/csv" || e.dataTransfer.files[0].type === "application/vnd.ms-excel") {
                            const customerPrices = await e.dataTransfer.files[0].text();
                            const res = parse(customerPrices, { header: true });
                            // Recursively add products
                            buildProducts(res.data)
                            setImportDone(true);
                        } else {
                            console.log("Error: File type does not match text/csv")
                        }
                    }}
                >
                    Drag CSV to here import Prices
                </div>
        //     </td>
        // </tr>
    );

    const pricingTable = e => {
        if (!importDone || pricing.length == 0) {
            return <DragNDropElement />
        } else {
            return pricing.map(currentcustomer => {
                return <CustomerPrices price={currentcustomer} deleteCustomerPrice={deleteCustomerPrice} key={pricing.indexOf(currentcustomer)} />;
            });
        }
    }

    const columns = [
        {
            dataField: "sku",
            text: "Product SKU",
            sort: true
        },
        {
            dataField: "title",
            text: "Title",
            sort: true
        },
        {
            dataField: "Customer",
            text: "Customer",
            sort: true
        },
        {
            dataField: "Price",
            text: "Price",
            sort: true
        }
    ];

    const paginatedTable = e => (
        <BootstrapTable
            bootstrap4
            keyField="sku"
            data={pricing}
            columns={columns}
            pagination={paginationFactory({ sizePerPage: 5 })}
        />
    )

    return (
        <div>
            <h6>Import Products</h6>
            <Form id="submit-new-pricing" onSubmit={ onSubmit } className="mb-3">
                <div>
                    { DragNDropElement() }
                </div>
                <br/>
                { paginatedTable() }
                {/* <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sku</th>
                            <th>Title</th>
                            <th>Customer</th>
                            <th>Price</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        { pricingTable() }
                    </tbody>
                </Table> */}
                <br/>
                <Button onClick={() => setPricing([])}>Clear</Button>
                <br/><br/>
                <Button as={Link} to="/admin/pricing" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Import</Button>
            </Form>
        </div>
    );
}

export default ImportPricing;