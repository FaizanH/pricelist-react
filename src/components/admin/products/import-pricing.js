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

    let tempCustomers = [];
    let slicedArray = [];
    let tempPricing = [];

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

    const moreEfficientBuild = async (productline, skus, customers) => {
        if (productline.priceid !== "") {
            if (!skus.includes(productline.sku)) {
                // Not duplicate sku
                skus.push(productline.sku);
                tempPricing.push(productline);

                // Check for unique Customer Names
                if (!customers.includes(productline.Customer)) {
                    customers.push(productline.Customer);
                    // Create customer
                    let newCustomer = {
                        name: productline.Customer,
                        email: "" // Empty email for imports
                    }
                    tempCustomers.push(newCustomer);
                }
            }
            else {
                // Duplicate sku found. Only create price
                tempPricing.push(productline);
            }
        }
    }

    // Testing code
    const doImportPricingBatch = async (batch) => {
        batch = {
            data: batch
        }
        setTimeout(() => {
            return Promise.resolve(importPricing(batch));
        }, 1000)
    }

    const doImport = async (largeArray) => {
        return Promise.all( largeArray.map(element => doImportPricingBatch(element)) )
    }

    const onSubmit = async e => {
        e.preventDefault();
        // console.log(pricing);

        // Import in batches of 1000
        var i, chunk = 1000;
        if (pricing.length > 1000) {
            for (i=0; i<pricing.length; i+=chunk) {
                let batch = pricing.slice(i, i+chunk);
                slicedArray.push(batch);
            }
            console.log(slicedArray);
            doImport(slicedArray).then(() => {
                console.log("All Imports Completed");
            })
        } else { // Account for last non-1000 batch
            console.log(pricing);
            doImportPricingBatch(pricing).then(() => {
                console.log("Import Completed");
            })
        }
    }

    // const loopAsync = async e => {

    //     doImportPricingBulk(batch).then(() => {
    //         if (!importComplete) {
    //             if (i < pricing.length) {
    //                 batch = pricing.slice(i, i + chunk);
    //                 i += chunk;
    //                 console.log("Running import: ");

    //                 loopAsync();
    //             } else {
    //                 importComplete = true;
    //             }
    //         } else {
    //             console.log("All Imports Completed");
    //         }

    //         // doImportCustomersBulk(customers).then(() => {
    //         //     console.log("All Imports Completed");
    //         //                             // setTimeout(() => {
    //         // //     window.location = "/admin/products";
    //         // // }, 2500)
    //         // })
    //     })
    // }

    const importCSV = e => {
        e.preventDefault();
        setPricing(tempPricing);
        setCustomers(tempCustomers);
        // console.log(tempCustomers);
        // console.log(tempPricing);
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
                        tempPricing = [];
                        tempCustomers = [];

                        if (e.dataTransfer.files[0].type === "text/csv" || e.dataTransfer.files[0].type === "application/vnd.ms-excel") {
                            // Parse csv
                            const customerPrices = await e.dataTransfer.files[0].text();
                            let uniqueSkus = [];
                            let uniqueCustomers = [];

                            parse(customerPrices, {
                                header: true,
                                worker: true,
                                step: line => {
                                    moreEfficientBuild(line.data, uniqueSkus, uniqueCustomers);
                                },
                                complete: r => {
                                    console.log("Finished importing prices");
                                    // setImportDone(true);
                                }
                            });

                            // Recursively add products
                            // buildProducts(res.data)
                            // setImportDone(true);
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
            dataField: "priceid",
            text: "Price ID",
            sort: true
        },
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
            keyField="priceid"
            data={pricing}
            columns={columns}
            pagination={paginationFactory({ sizePerPage: 10 })}
        />
    )

    return (
        <div>
            <h6>Import Products</h6>
            <Form id="submit-new-pricing" onSubmit={ onSubmit } className="mb-3">
                <div>
                    <DragNDropElement setLoadingState={props.setLoadingState} />
                    <br/>
                    <Button variant="primary" onClick={importCSV}>Import CSV</Button>
                    {/* { DragNDropElement() } */}
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
                <Button variant="primary" type="submit">Import Prices</Button>
            </Form>
        </div>
    );
}

export default ImportPricing;