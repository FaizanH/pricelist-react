const router = require("express").Router();
let Product = require("../models/product.model");
let Price = require("../models/price.model");

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const query = req.query.q;
        const customerQuery = req.query.custq;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalProducts = await model.countDocuments().exec();

        const results = {};

        if (endIndex < totalProducts) {
            results.next = {
                page: page + 1
            }
        }

        if (startIndex > 0) {
            results.prev = {
                page: page - 1
            }
        }

        results.current = {
            page: page
        }

        results.total = Math.ceil(totalProducts / limit);

        try {
            console.log(query)
            console.log(customerQuery)
            if (query || customerQuery) {
                let productQuery = [];
                let custQuery = { "Customer": { $regex: customerQuery } };

                if (query) {
                    productQuery.push(
                        { "sku": { $regex: query } },
                        { "title": { $regex: query } }
                    )
                }

                if (query && customerQuery) {
                    results.results = await model.find({
                        $and: [
                            custQuery,
                            { $or: productQuery }
                        ]
                    })
                    .limit(limit).skip(startIndex).exec();
                } else {
                    if (customerQuery) {
                        productQuery.push(custQuery);
                    }
                    results.results = await model.find({$or:productQuery}).limit(limit).skip(startIndex).exec();
                }
            } else {
                results.results = await model.find().limit(limit).skip(startIndex).exec();
            }
            res.paginatedResults = results;
            next()
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    }
}

router.route("/").get(paginatedResults(Product), (req, res) => {
    res.json(res.paginatedResults);
});

router.route("/prices").get(paginatedResults(Price), (req, res) => {
    res.json(res.paginatedResults);
    // Price.find()
    // .then(price => res.json(price))
    // .catch(err => res.status(400).json("Error:" + err));
});

router.route("/sku/:sku").get((req, res) => {
    Product.findOne({"sku": req.params.sku}, function(err, product) {
        if (err) {
            throw err;
        } else if (product) {
            res.json(product);
        } else {
            res.json({"Error": "No product with given sku found"});
        }
    });
});

router.route("/search").get((req, res) => {
    const sku = req.query.sku;
    Product.findOne({sku})
        .then(product => res.json(product))
        .catch(err => res.status(400).json("Error: " + err));

    // Price.findByIdAndDelete(req.params.id)
    //     .then(price => res.json("Price deleted: " + price))
    //     .catch(err => res.status(400).json("Error: " + err));
})

router.route("/id/:id").get((req, res) => {
    Product.findById(req.params.id, function(err, product) {
        if (err) {
            throw err;
        } else if (product) {
            res.json(product);
        } else {
            res.json({"Error": "No product with given id found"});
        }
    });
});

router.route("/:id").delete((req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => res.json("Product deleted: " + product))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
    const sku = req.body.sku;
    const title = req.body.title;
    // const availability = req.body.availablitity;
    // const active = req.body.active;
    // const description = req.body.description;
    // const image = req.body.image;
    // const stockOnHand = req.body.stockOnHand;
    const pricing = req.body.pricing;
    const newProduct = new Product({ sku, title });

    if (pricing.length > 0) {
        pricing.map(price => {
            let newPrice = new Price({ sku, Customer: price.Customer, Price: price.Price });
            // Check for duplicates
            newPrice.save()
                    .then(() => res.json("New Price Created"))
                    .catch(err => res.status(400).json("Error:" + err));
        });
    }

    newProduct.save()
                .then(() => res.json("New Product Created"))
                .catch(err => res.status(400).json("Error:" + err));
});

router.route("/update").post((req, res) => {
    Product.findOne({ "sku": req.body.sku })
        .then(product => {
            product.sku = req.body.sku;
            product.active = req.body.active;
            product.title = req.body.title;

            product.save()
                .then((post) => {
                    res.json("Product updated");
                })
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
});

// Pricing specific endpoints

router.route("/prices/update").post((req, res) => {
    const sku = req.body.sku;
    const Customer = req.body.Customer;

    Price.findOne({sku, Customer})
        .then(price => {
            price.Price = req.body.Price;

            price.save()
                .then((post) => {
                    res.json("Price updated");
                })
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err))
});

router.route("/prices/add").post((req, res) => {
    const sku = req.body.sku;
    const p = req.body.Price;
    const Customer = req.body.Customer;
    Price.findOne({"Customer": Customer, sku}, function(err, price) {
        if (err) {
            throw err;
        } else if (price) {
            // Duplicate
            res.json({"Message": "Duplicate Found, skipping"});
        } else {
            let newPrice = new Price({ sku, Customer, "Price": p });
            newPrice.save()
                    .then(() => res.json("New Price Created"))
                    .catch(err => res.status(400).json("Error:" + err));
        }
    })
})

router.route("/prices/search").get((req, res) => {
    const sku = req.query.sku;

    Price.find({sku})
        .then(prices => res.json(prices))
        .catch(err => res.status(400).json("Error: " + err));

    // Price.findByIdAndDelete(req.params.id)
    //     .then(price => res.json("Price deleted: " + price))
    //     .catch(err => res.status(400).json("Error: " + err));
})

router.route("/prices/:id").delete((req, res) => {
    Price.findByIdAndDelete(req.params.id)
        .then(price => res.json("Price deleted: " + price))
        .catch(err => res.status(400).json("Error: " + err));
})

router.route("/prices/:sku/:Customer").delete((req, res) => {
    const sku = req.params.sku;
    const Customer = req.params.Customer;

    // Product.updateOne(
    //     {"_id": req.params.prodid},
    //     { "$pull": {"pricing": {"Customer": req.params.Customer}} }
    // )
    // .then(deleted => res.json("Price removed: " + deleted))
    // .catch(err => res.status(400).json("Error: " + err));

    Price.findOneAndDelete({Customer, sku})
        .then(price => res.json("Price deleted: " + price))
        .catch(err => res.status(400).json("Error: " + err));
});



module.exports = router;