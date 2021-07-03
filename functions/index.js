const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dbconf = require("./dbconf");
const uri = dbconf.ATLAS_URI;
const decodeIDToken = require('./authenticateToken');
// https://pricelist-boulvandre.web.app
const app = express();
app.use(cors({credentials: true, origin: "http://localhost:3000", methods: "GET, HEAD, PUT, PATCH, POST, DELETE"}));
app.use(express.json());
app.use(decodeIDToken);

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Database
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const customersRouter = require("./routes/customers");

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/customers", customersRouter);

app.get("/", (req, res) => {
    res.send("You have landed on the API server for the Pricelist Platform");
});

exports.app = functions.https.onRequest(app);