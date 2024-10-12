const User = require("../models/users.model");
const { verifyJwt } = require("../../utils/jwt/jwt");

const isAuth = async (req, res, next) => {
  try {
    // Leer el token desde la cookie en lugar del encabezado de autorización
    const token = req.cookies.token;
    if (!token) {
      return next("Unauthorized");
    }

    const validToken = verifyJwt(token);
    const userLogged = await User.findById(validToken.id);

    if (!userLogged) {
      return next("User not found");
    }

    // Remover la contraseña antes de pasar el usuario a la request
    userLogged.password = null;
    req.user = userLogged;
    next();
  } catch (error) {
    return next("Error");
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
