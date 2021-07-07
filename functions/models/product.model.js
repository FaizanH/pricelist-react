const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const default_url = "https://via.placeholder.com/300";

const imagesSchema = {
    main_url: {
        type: String,
        default: default_url
    },
    alt_1: {
        type: String,
        default: default_url
    },
    alt_2: {
        type:String,
        default: default_url
    },
    alt_3: {
        type:String,
        default: default_url
    }
};

const availabilitySchema = {
    policy: {
        type: String,
        enum: ["Track stock", "Do not track stock"],
        default: "Track stock"
    },
    stock_on_hand: {
        type: Number,
        default: 0
    },
    warehouse: {
        type: String,
        default: "Default"
    }
};

const productSchema = new Schema({
    sku: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    active: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    },
    images: {imagesSchema},
    brand: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: ""
    },
    availability: {availabilitySchema}
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;