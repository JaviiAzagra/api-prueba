const express = require("express");
const { isAdmin, isAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { generateSign } = require("../../utils/jwt/jwt");
const User = require("../models/users.model");
const { uploadFile } = require("../middlewares/cloudinary");
const router = express.Router();

//secure: process.env.NODE_ENV === "development",

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json("Error al leer los usuarios");
  }
});

router.get("/id", [isAuth], async (req, res, next) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/:email", [isAdmin], async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    console.log("Email:", req.body.email); // Log para ver el email
    const userDB = await User.findOne({ email: req.body.email });
    if (!userDB) {
      console.log("User not found"); // Log si no se encuentra el usuario
      return res.status(404).json("User does not exist");
    }
    const isMatch = bcrypt.compareSync(req.body.password, userDB.password);
    console.log("Password match:", isMatch); // Log para ver si las contraseñas coinciden
    if (isMatch) {
      const token = generateSign(userDB._id, userDB.email);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ userDB });
    } else {
      console.log("Incorrect password"); // Log si la contraseña es incorrecta
      return res.status(401).json("Password is incorrect!");
    }
  } catch (error) {
    console.error("Error in login:", error); // Log para errores
    return next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token"); // Elimina la cookie del token
    return res.status(200).json({ message: "Logout successful" }); // Asegúrate de devolver un objeto JSON
  } catch (error) {
    return next(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { email, password, name, surname, phone, gender } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      email,
      password,
      name,
      surname,
      phone,
      gender,
    });

    const createdUser = await newUser.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    console.error(error); // Agrega esta línea para registrar el error
    return res.status(500).json({
      message: "No se ha podido crear el usuario",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    return res.status(200).json("User deleted successfully!");
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const userModify = new User(user);
    userModify._id = id;
    await User.findByIdAndUpdate(id, userModify);
    return res.status(200).json("User edited successfully!");
  } catch (error) {
    return next(error);
  }
});

router.post("/checksession", [isAuth], async (req, res, next) => {
  console.log(req.header.authorization);
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
