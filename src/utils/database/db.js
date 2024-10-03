const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

const connectDb = async () => {
    try {
        const db = await mongoose.connect(DB_URL);

        const { name, host } = db.connection;
        console.log(`The connection to the DB with the name: ${name} and the host: ${host} was successful`);
    } catch (error) {
        console.log("ERROR: The connection to the database wasn't successful: " + error);
    }
};

module.exports = connectDb;
