const express = require("express");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
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

// Conectar a la base de datos
connectDb()
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

// Configuración de CORS
const allowedOrigins = [
  "http://192.168.1.43:3001",
  "http://192.168.1.43:3000",
  "http://192.168.1.40:3000",
  "http://localhost:3000",
  "https://api-prueba-fronted.vercel.app",
];

server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware para analizar JSON y formularios
server.use(express.json({ limit: "20mb" }));
server.use(express.urlencoded({ extended: false }));

// Rutas
server.use("/", indexRoutes);
server.use("/peripherals", peripheralRoutes);
server.use("/users", userRoutes);

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Obtener el token de las cookies

  if (!token) {
    return res.status(403).json({ message: "Acceso denegado" }); // No hay token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    req.user = decoded; // Almacena el usuario decodificado en req
    next(); // Llama al siguiente middleware o ruta
  } catch (error) {
    return res.status(401).json({ message: "Token no válido" }); // Token no válido
  }
};

// Ejemplo de ruta protegida
server.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

// Manejo de rutas no encontradas
server.use("*", (req, res) => {
  return res.status(404).json({ message: "PATH NOT FOUND! 404" });
});

// Manejo de errores
server.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message || "unexpected error",
    status: error.status || 500,
  });
});

// Iniciar el servidor
server.listen(PORT || 3000, () => {
  console.log(`Server running on --> http://localhost:${PORT}`);
});
