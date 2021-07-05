const router = require("express").Router();
let User = require("../models/user.model");

router.route("/validate").post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ "username": username}, function(err, user) {
        if (err) {
            throw err;
        } else if (user) {
            user.comparePasswordChange(password, function(err, isMatch) {
                if (err) throw err;
                res.json(isMatch);
            });
        } else {
            res.json({"Error": "User with given username not found"});
        }
    });
});

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
	User.findById(req.params.id, function(err, user) {
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
    // if (auth) {
        User.findByIdAndDelete(req.params.id)
            .then(user => res.json("User deleted: " + user))
            .catch(err => res.status(400).json("Error: " + err));
    // }
});

router.route("/email").post((req, res) => {
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
});

router.route("/add").post((req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email_address = req.body.email_address;
    const permission_group = req.body.permission_group;

    const newUser = new User({
        username,
        password,
        first_name,
        last_name,
        email_address,
        permission_group
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

router.route("/updateUser/:id").post((req, res) => {
    // const auth = req.currentUser;
    // if (auth) {
        const username = req.body.username;
        const permission_group = req.body.permission_group;
        if (username) {
            User.findOne({"_id": req.params.id}, function(err, user) {
                if (err) {
                    throw err;
                } else if (user) {
                    user.username = username;
                    user.permission_group = permission_group;
                    user.save()
                        .then(() => res.json(`User Updated: ${user}`))
                        .catch(err => res.status(400).json("Error: " + err));
                    console.log(user);
                } else {
                    res.json({"Error": "No user with given username found"});
                }
            });
        } else {
            res.json({"Error": "No username supplied"});
        }
    // }
});

module.exports = router;