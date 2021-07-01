const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
    // Re-enable auth check after tests
    // const auth = req.currentUser;
    // Add extra checks for permissions
    // if (auth) {
        User.find()
            .then(users => res.json(users))
            .catch(err => res.status(400).json("Error: " + err));
    // }
    // res.status(403).send("Not authorised");
});

router.route("/id/:id").get((req, res) => {
    // const auth = req.currentUser;
    // if (auth) {
        User.findById(req.params.id, function(err, user) {
            if (err) {
                throw err;
            } else if (user) {
                res.json(user)
            } else {
                res.json({"Error": "No user with given id found"});
            }
        });
    // }
});

router.route("/:id").delete((req, res) => {
    const auth = req.currentUser;
    if (auth) {
        User.findByIdAndDelete(req.params.id)
            .then(user => res.json("User deleted: " + user))
            .catch(err => res.status(400).json("Error: " + err));
    }
});

router.route("/email").post((req, res) => {
    const auth = req.currentUser;
    if (auth) {
        let email = req.body.email;
        User.findOne({"email_address": email}, function(err, user) {
            if (err) {
                throw err;
            } else if (user) {
                res.json(user);
            } else {
                res.json({"Error": "No user with given email found"});
            }
        });
    }
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

    const newUser = new User({
        username,
        password,
        first_name,
        last_name,
        email_address,
        permission_group,
        // phone,
    });

    User.findOne({"username": username}, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            res.json("Username already exists");
        } else {
            newUser.save()
                    .then(() => res.json("New User Created"))
                    .catch(err => res.status(400).json("Error: " + err));
        }
    });
});

router.route("/changePassword/:id").post((req, res) => {
    const auth = req.currentUser;
    if (auth) {
        const username = req.body.username;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
    
        User.findOne({"username": username}, function(err, user) {
            if (err) {
                throw err;
            } else if (user) {
                user.comparePassword(currentPassword, function(err, isMatch) {
                    if (err) {
                        throw err;
                    }
                    console.log(isMatch);
                    if (isMatch) {
                        user.password = newPassword;
                        user.save()
                        .then(() => res.json(`User hash Updated: ${user}`))
                        .catch(err => res.status(400).json("Error: " + err));
                    } else if (isMatch == -1) {
                        res.json({"Error: ": "Current Password incorrect"});
                    }
                });
            } else {
                res.json({"Error": "No user with given username found"});
            }
        });
    }
});

module.exports = router;