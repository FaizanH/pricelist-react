import React, { Component, useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import Select from 'react-select'
import { Link } from "react-router-dom";
import axios from "axios";
import { createProduct, getCustomers, createPrice, deletePrice, createCustomer, importProducts } from "../../../services/services";
import deployment from "../../../deployment";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { parse } from "papaparse";

const ImportProducts = props => {
    const [products, setProducts] = useState([]);
    const [importDone, setImportDone] = useState(false);

    let _isMounted = false;

    useEffect(() => {
        _isMounted = true;
        
        return () => { _isMounted = false };
    }, [products]);

    const deleteProduct = async (e, sku) => {
        e.preventDefault();
        e.stopPropagation();
        // let res = await deletePrice(sku, Customer);
        // if (res.status !== 400) {
        setProducts(products.filter(el => el.sku !== sku));
        // }
    }

    const Products = props => (
        <tr>
            <td>{props.product.sku}</td>
            <td>{props.product.title}</td>
            <td>
                {/* <Link to={"/admin/customers/edit/" + props.customer._id}>edit</Link> | */}
                <a href="javascript:void(0)" onClick={(e) => {props.deleteProduct(e, props.product.sku) }}>delete</a>
            </td>
        </tr>
    );

    const importProduct = async (element) => {
        Promise.resolve(createProduct(element));
    }

    const importCheck = async (type, element) => {
        if (type === "products") {
            return importProduct(element);
        }
    }

    const doImport = async (type, array) => {
        return Promise.all( array.map(element => importCheck(type, element)) )
    }

    const doImportProductsBulk = async (d) => {
        d = {
            data: d
        }
        console.log(d);
        let res = await importProducts(d);
        if (res) {
            console.log("Import completed: " + res);
                        // setTimeout(() => {
            //     window.location = "/admin/products";
            // }, 2500)
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        console.log(products);
        // doImport("products", products).then(r => {
        //     console.log("Import completed: " + r);
        //     // setTimeout(() => {
        //     //     window.location = "/admin/products";
        //     // }, 2500)
        // })
        doImportProductsBulk(products);
    }

    const buildProducts = async payload => {
        // Build products list
        let uniqueSkus = [];
        console.log(payload);
        payload.map(productline => {
            // if sku exists in products
            if (productline.sku !== "") {
                if (!uniqueSkus.includes(productline.sku)) {
                    // Not duplicate sku
                    uniqueSkus.push(productline.sku);

                    // Create new product
                    let newProduct = {
                        sku: productline.sku,
                        title: productline.title,
                        pricing: new Array(0) // No need to add products this way in this method
                    };
                    setProducts(prev => [...prev, newProduct]);
                }
                else {
                    // Duplicate sku found
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
                            const products_file = await e.dataTransfer.files[0].text();
                            const res = parse(products_file, { header: true });
                            // Recursively add products
                            buildProducts(res.data)
                            setImportDone(true);
                        } else {
                            console.log("Error: File type does not match text/csv")
                        }
                    }}
                >
                    Drag CSV here to import Products
                </div>
        //     </td>
        // </tr>
    );

    const productsTable = e => {
        if (!importDone || products.length == 0) {
            return <DragNDropElement />
        } else {
            return products.map(currentproduct => {
                return <Products product={currentproduct} deleteProduct={deleteProduct} key={products.indexOf(currentproduct)} />;
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
          text: "Product Name",
          sort: true
        }
      ];

    const paginatedTable = e => (
        <BootstrapTable
            bootstrap4
            keyField="sku"
            data={products}
            columns={columns}
            pagination={paginationFactory({ sizePerPage: 5 })}
        />
    )

    return (
        <div>
            <h6>Import Products</h6>
            <Form id="submit-new-products" onSubmit={ onSubmit } className="mb-3">
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
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        { productsTable() }
                    </tbody>
                </Table> */}
                <br/>
                <Button onClick={() => setProducts([])}>Clear</Button>
                <br/><br/>
                <Button as={Link} to="/admin/products" variant="primary">Back</Button>
                <Button variant="primary" type="submit">Import</Button>
            </Form>
        </div>
    );
}

export default ImportProducts;