import React, { Component, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, NavLink } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../deployment";

const Product = props => {
    const [product, setProduct] = useState({
        images: {
            imagesSchema: {
                main_url: "https://via.placeholder.com/300"
            }
        }
    });
    const { id } = useParams();

    useEffect(() => {
            getProduct();
    }, []);

    const getProduct = async e => {
        // Set loading modifiers
        props.setLoadingState(true);
        props.setLoadingState(false);
        const res = await axios.get(deployment.localhost + "/products/" + id)
                                    .catch(err => console.log(err));
        if (res) {
            setProduct(res.data);
            props.setLoadingState(false);
        }
    }

    const BuyingOptions = props => (
        <div className="buying-options">
            <p>{product.brand}</p>
            <h5>{product.title}</h5>
            <h6>${product.price}</h6>
            <Button onClick={() => addToCart(product, 1) }>ADD TO CART</Button>
        </div>
    )

    const ProductMainWrapper = props => (
        <div className="product-main-wrapper row" aria-label="Product buying options">
            <div className="col-6">
                <img src={product.images.imagesSchema.main_url} alt={""} />
            </div>
            <div className="col-6">
                <BuyingOptions />
            </div>
        </div>
    )

    const ProductDescription = props => (
        <div className="product-description-wrapper row" aria-label="Product information">
            <div className="col-12">
                <h5>Description</h5>
            </div>
        </div>
    )

    function addToCart(product, quantity) {
        let userLoggedIn = false;
        let payload = {
            "orderSku": product.sku,
            "orderTitle": product.title,
            "orderPrice": product.price,
            "orderQuantity": Number.parseInt(quantity)
        };

        if (!userLoggedIn) {
            // Check if cartline exists
            let userCart = JSON.parse(localStorage.getItem("guest_cartlines"));

            if (userCart == null)
                userCart = [];

            let i = userCart.findIndex(cartline => cartline.orderSku == payload.orderSku);

            if (i > -1) {
                if (userCart != null && userCart.length != 0) {
                    userCart[i].orderQuantity += payload.orderQuantity;
                    localStorage.setItem("guest_cartlines", JSON.stringify(userCart));
                }
            } else {
                userCart.push( payload );
                localStorage.setItem("guest_cartlines", JSON.stringify(userCart));
            }
        }
    }

    return (
        <div className="page-top">
            <div className="page-header row">
                <div className="breadcrumbs">
                    
                </div>
            </div>
            <ProductMainWrapper />
            <ProductDescription />
        </div>
    )
}

export default Product;