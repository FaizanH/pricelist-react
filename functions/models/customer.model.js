const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customerName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;