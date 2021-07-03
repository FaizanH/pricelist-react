const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priceSchema = new Schema({
    sku: {
        type: String,
    },
    Customer: {
        type: String,
    },
    Price: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const Price = mongoose.model("Price", priceSchema);
module.exports = Price;