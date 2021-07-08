const router = require("express").Router();
let Customer = require("../models/customer.model");
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
        let searchMatches = [];

        const results = {};

        try {
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

                    searchMatches = await model.find({
                        $and: [
                            custQuery,
                            { $or: productQuery }
                        ]
                    }).exec();
                } else {
                    if (customerQuery) {
                        productQuery.push(custQuery);
                    }
                    results.results = await model.find({$or:productQuery}).limit(limit).skip(startIndex).exec();
                    searchMatches = await model.find({$or:productQuery}).exec();
                }
            } else {
                results.results = await model.find().limit(limit).skip(startIndex).exec();
            }
            console.log(searchMatches.length);
            console.log(searchMatches);

            if (searchMatches.length > 0) {
                results.total = Math.ceil(searchMatches.length / limit);
                if (endIndex < searchMatches.length ) {
                    results.next = {
                        page: page + 1
                    }
                }
            } else {
                results.total = Math.ceil(totalProducts / limit);
                if (endIndex < totalProducts ) {
                    results.next = {
                        page: page + 1
                    }
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
            results.totalCustomers = totalProducts;
            res.paginatedResults = results;
            next()
        } catch (e) {
            res.status(500).json({message: e.message})
        }
    }
}

router.route("/").get(paginatedResults(Customer), (req, res) => {
    res.json(res.paginatedResults);
});

// router.route("/").get((req, res) => {
//     // if (auth) {
//         Customer.find()
//             .then(customer => res.json(customer))
//             .catch(err => res.status(400).json("Error: " + err));
//     // }
//     // res.status(403).send("Not authorised");
// });

router.route("/:id").get((req, res) => {
	Customer.findById(req.params.id, function(err, customer) {
		if (err) {
			throw err;
		} else if (customer) {
			res.json(customer)
		} else {
			res.json({"Error": "No customer with given id found"});
		}
	});
});

router.route("/:id").delete((req, res) => {
    // const auth = req.currentUser;
    // if (auth) {
        Customer.findByIdAndDelete(req.params.id)
            .then(customer => {
                Price.deleteMany({"Customer": customer.name})
                    .then(r => res.json("Customers deleted: "));
            })
            .catch(err => res.status(400).json("Error: " + err));
    // }
});

router.route("/email").post((req, res) => {
	let email = req.body.email;
	Customer.findOne({"email": email}, function(err, customer) {
		if (err) {
			throw err;
		} else if (customer) {
			res.json(customer);
		} else {
			res.json({"Error": "No user with given email found"});
		}
	});
});

router.route("/add").post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    const newCustomer = new Customer({
        name,
        email
    });

    Customer.findOne({name}, function(err, customer) {
        if (err) {
            throw err;
        } else if (customer) {
            res.json("Customer already exists");
        } else {
            newCustomer.save()
                    .then(() => res.json("New Customer Created"))
                    .catch(err => res.status(400).json("Error: " + err));
        }
    });
});

router.route("/update").post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    Customer.findOne({email})
        .then(customer => {
            customer.name = name;
            customer.email = email;

            customer.save()
                .then((post) => {
                    res.json("Customer updated");
                })
                .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err))
});

async function importCustomerPromise(payload, res) {
    return Promise.all( payload.map(customer => {
        const name = customer.name;
        // const email = customer.email;

        const newCustomer = new Customer({ name });

        Customer.findOne({name}, function(err, customer) {
            if (customer) {
            } else if (err) {
                res.status(400).json("Error: " + err)
            } else {
                newCustomer.save()
                        .catch(err => res.status(400).json("Error:" + err));
            }
        })
    }) );
}

router.route("/import").post(async (req, res) => {
    let payload = req.body.data;

    importCustomerPromise(payload, res).then(r => {
        res.json("Customers Imported");
    })
})

module.exports = router;