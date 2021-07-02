const router = require("express").Router();
let Product = require("../models/product.model");

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

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
            results.results = await model.find().limit(limit).skip(startIndex).exec();
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

router.route("/:sku").get((req, res) => {
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
    const newProduct = new Product( {sku, title, pricing} );

    newProduct.save()
                .then(() => res.json("New Product Created"))
                .catch(err => res.status(400).json("Error:" + err));
});

router.route("/update/:id").post((req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            product.sku = req.body.sku;
            product.active = req.body.active;
            product.title = req.body.title;
            product.pricing = req.body.pricing;

            product.save()
                .then((post) => {
                    console.log(post);
                    res.json("Product updated");
                })
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
});

// Pricing specific endpoints
router.route("/pricing/:prodid/:Customer").delete((req, res) => {
    console.log(req.params.Customer);
    Product.updateOne(
        {"_id": req.params.prodid},
        { "$pull": {"pricing": {"Customer": req.params.Customer}} }
    )
    .then(deleted => res.json("Price removed: " + deleted))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/pricing").post((req, res) => {
    console.log(req.body.Customer);
    Product.updateOne(
        {"_id": req.body.prodid},
        { "$set": {
            "pricing.$[pricing].Price": req.body.Price
        }},
        {"arrayFilters": [
            {
                "pricing.Customer": req.body.Customer
            }
        ]}
    )
    .then(updated => res.json("Price updated: " + updated))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;