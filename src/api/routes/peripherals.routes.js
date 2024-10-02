const express = require("express");
const router = express.Router();
const Peripheral = require("../models/peripherals.model");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");

router.get("/", async (req, res, next) => {
    try {
        const allPeripherals = await Peripheral.find();
        res.status(200).json(allPeripherals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const onePeripheral = await Peripheral.findById(req.params.id);
        res.status(200).json(onePeripheral);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/brand/:brand", async (req, res, next) => {
    try {
        const brand = req.params.brand;
        const peripheralToFind = await Peripheral.find({ brand: brand });
        return res.status(200).json(peripheralToFind);
    } catch (error) {
        return next(error);
    }
});

router.post("/create", uploadFile.single("img"), async (req, res, next) => {
    try {
        const peripheral = req.body;
        if (req.file) {
            peripheral.img = req.file.path;
        }
        const newPeripheral = new Peripheral(peripheral);
        const created = await newPeripheral.save();
        return res.status(201).json(created);
    } catch (error) {
        return next(error);
    }
});

router.put("/edit/:id", uploadFile.single("img"), async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        if (req.file) {
            updatedData.image = req.file.path;
        }

        const updatedPeripheral = await Peripheral.findByIdAndUpdate(id, updatedData, { new: true });
        return res.status(200).json(updatedPeripheral);
    } catch (error) {
        return next(error);
    }
});

router.delete("/delete/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const peripheral = await Peripheral.findById(id);
        if (peripheral.img) {
            deleteFile(peripheral.img);
        }
        const peripheralToDelete = await Peripheral.findByIdAndDelete(id);
        return res.status(200).json(`The peripheral has been deleted --> ${peripheralToDelete}`);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
