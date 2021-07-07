const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    sku: {
        type: String,
    },
    title: {
        type: String,
    },
    Customer: {
        type: String,
    },
    Price: {
        type: String,
    }
}, {
    timestamps: true,
});

const Price = mongoose.model("Price", priceSchema);
module.exports = Price;