import React, { Component, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Form, InputGroup, FormControl, Pagination } from "react-bootstrap";
import { getPrices} from "../../../../services/services";

let _isMounted = false;
let startMidPages = 2;
let endMidPages = 2;

const ViewPricing = props => {
    const [prices, setProducts] = useState([]);
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
        if (update || prices.length === 0) {
            fetchData(page, 5);
        }

        return () => { _isMounted = false };
    }, [update]);

    const fetchData = async (page, limit) => {
        let res = await getPrices(page, limit, queryString, custQuery);
        if (res) {
            setProducts(res);
            endMidPages = res.total;
            setUpdate(false);
        }
    }

    const searchCustomer = e => {
        e.preventDefault();
        setUpdate(true);
    }

    const CustomerPrice = React.forwardRef((props, ref) => (
        <tr>
            <td>{props.price.Customer}</td>
            <td><Link to={"/admin/products/edit?sku=" + props.product.sku}>{props.product.sku}</Link></td>
            <td>{props.product.title}</td>

            <td>
            <Form.Control
                type="text"
                placeholder="Price"
                defaultValue={props.price.Price}
                disabled={true}
                ref={ref}
            />
            </td>
        </tr>
    ));

    const productsList = e => {
        if (prices != "") {
            return prices.results.map(currentprice => {
                return <CustomerPrice ref={React.createRef()} product={currentprice} price={currentprice} key={currentprice._id} />;
            });
        }
    }

    const prevPage = e => {
        e.preventDefault();
        if (prices.prev) {
            setPage(prices.prev.page);
            setUpdate(true);
        }
    }

    const nextPage = e => {
        e.preventDefault();
        if (prices.next) {
            setPage(prices.next.page);
            setUpdate(true);
        }
    }

    const goToPage = (e, p) => {
        e.preventDefault();
        if (p <= prices.total) {
            setPage(p);
            setUpdate(true);
        }
    }

    const checkPagination = e => {
        if (prices) {
            if (prices.total > 10) {
                // startMidPages = Math.ceil(products.total / 2);
                endMidPages = startMidPages + 3;
                if (endMidPages >= prices.total) {
                    endMidPages = prices.total - 1;
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
        if (endMidPages < prices.total - 1) {
            startMidPages = startMidPages + 4;
            setUpdate(true);
        }
    }

    const listPages = e => {
        if (prices && prices.total > 1) {
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

            {(prices.total > 10 && startMidPages > 2) ? <Pagination.Ellipsis onClick={e => rotateMidPagesBackwards(e)}/> : null}

            { listPages() }

            {(prices.total > 10 && endMidPages < prices.total - 1) ? <Pagination.Ellipsis onClick={e => rotateMidPagesForward(e)} /> : null}
            {prices.total > 10 ? <Pagination.Item key={prices.total+"-lastpg"} active={page === prices.total} onClick={ e => goToPage(e, prices.total) }>{prices.total}</Pagination.Item> : null}
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
                        placeholder="Customer"
                        onChange={e => setCustQuery(e.target.value)}
                    />
                    <FormControl
                        type="text"
                        placeholder="Product Keywords"
                        onChange={e => setQueryString(e.target.value)}
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

export default ViewPricing;