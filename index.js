const express = require("express");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./src/utils/database/db");
const cookieParser = require("cookie-parser");

const server = express();
server.use(cookieParser());

const indexRoutes = require("./src/api/routes/index.routes");
const userRoutes = require("./src/api/routes/users.routes");
const peripheralRoutes = require("./src/api/routes/peripherals.routes");

const PORT = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

connectDb();

const allowedOrigins = [
  "http://192.168.1.43:3001",
  "http://192.168.1.43:3000",
  "http://192.168.1.40:3000",
  "http://localhost:3000",
  "https://api-prueba-fronted.vercel.app/",
];

server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

server.use(express.json({ limit: "20mb" }));
server.use(express.urlencoded({ extended: false }));

server.use("/", indexRoutes);
server.use("/peripherals", peripheralRoutes);
server.use("/users", userRoutes);

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

server.listen(PORT || 3000, () => {
  console.log(`Server running on --> http://localhost:${PORT}`);
});
