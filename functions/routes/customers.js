const router = require("express").Router();
let Customer = require("../models/customer.model");

router.route("/").get((req, res) => {
    // if (auth) {
        Customer.find()
            .then(customer => res.json(customer))
            .catch(err => res.status(400).json("Error: " + err));
    // }
    // res.status(403).send("Not authorised");
});

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
    const auth = req.currentUser;
    if (auth) {
        Customer.findByIdAndDelete(req.params.id)
            .then(user => res.json("Customer deleted: " + user))
            .catch(err => res.status(400).json("Error: " + err));
    }
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

    Customer.findOne({"email": email}, function(err, customer) {
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

module.exports = router;