const express = require('express');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const cors = require('cors');
const connectDb = require("./src/utils/database/db");
const server = express();

const indexRoutes = require("./src/api/routes/index.routes");
const peripheralRoutes = require("./src/api/routes/peripherals.routes");

const PORT = process.env.PORT;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

/* db.connectDb(DB_URL); */
connectDb();

server.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

server.use(express.json({ limit: "20mb" }));
server.use(express.urlencoded({ extended: false }));


server.use("/", indexRoutes);
server.use("/peripherals", peripheralRoutes);

server.use("*", (req, res) => {
    const error = new Error("PATH NOT FOUND! 404");
    error.status = 404;
    return res.status(error.status).json(error.message);
});

server.use((error, req, res, next) => {
    return res
        .status(error.status || 500)
        .json(error.message || "unexpected error");
});

// Exportar la instancia de Express
module.exports = server;
