const User = require("../models/users.model");
const { verifyJwt } = require("../../utils/jwt/jwt");

const isAuth = async (req, res, next) => {
  try {
    // Aquí estás buscando el token en las cookies
    const token = req.cookies.token; // Accediendo al token desde las cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const validToken = verifyJwt(token);
    const userLogged = await User.findById(validToken.id);
    userLogged.password = null;
    req.user = userLogged;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Leer el token desde la cookie
    const token = req.cookies.token;
    if (!token) {
      return next("Unauthorized");
    }

    const validToken = verifyJwt(token);
    const userLogged = await User.findById(validToken.id);

    if (!userLogged) {
      return next("User not found");
    }

    // Comprobar si el usuario tiene el rol de admin
    if (userLogged.rol === "admin") {
      userLogged.password = null;
      req.user = userLogged;
      next();
    } else {
      return next("You're not an admin!");
    }
  } catch (error) {
    return next("Error");
  }
};

module.exports = { isAuth, isAdmin };
