const router = require("express").Router();
let Customer = require("../models/customer.model");

router.route("/").get((req, res) => {
    // if (auth) {
        Customer.find()
            .then(users => res.json(users))
            .catch(err => res.status(400).json("Error: " + err));
    // }
    // res.status(403).send("Not authorised");
});

router.route("/id/:id").get((req, res) => {
	Customer.findById(req.params.id, function(err, user) {
		if (err) {
			throw err;
		} else if (user) {
			res.json(user)
		} else {
			res.json({"Error": "No user with given id found"});
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
	Customer.findOne({"email_address": email}, function(err, user) {
		if (err) {
			throw err;
		} else if (user) {
			res.json(user);
		} else {
			res.json({"Error": "No user with given email found"});
		}
	});
});

router.route("/add").post((req, res) => {
    // const billing_details = [];
    // const shipping_address = [];
    // const payment_details = [];
    // const account_details = [];
    // const contact_log = [];

    const username = req.body.username;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email_address = req.body.email_address;
    const permission_group = req.body.permission_group;
    // const phone = req.body.phone;

    const newUser = new Customer({
        username,
        password,
        first_name,
        last_name,
        email_address,
        permission_group,
        // phone,
    });

    Customer.findOne({"username": username}, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            res.json("Username already exists");
        } else {
            newUser.save()
                    .then(() => res.json("New Customer Created"))
                    .catch(err => res.status(400).json("Error: " + err));
        }
    });
});

module.exports = router;