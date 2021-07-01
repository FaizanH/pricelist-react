const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email_address: {
        required: true,
        unique: true,
        minlength: 3,
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: ""
    },
    permission_group: {
        type: String,
        enum: ["Administrator", "Staff User", "Standard User"],
        default: "Standard User"
    }
}, {
    timestamps: true,
});

userSchema.pre("save", function(next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            //override cleartext password with hash
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.comparePasswordChange = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

// Only 15 mins is good (600 seconds)
userSchema.methods.generateVerificationToken = function() {
    return jwt.sign({ id: this._id }, jwtPrivateSecret, {
        expiresIn: "900s",
        algorithm: "RS256",
    });
}

const User = mongoose.model("User", userSchema);

module.exports = User;