const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const peripheralsSchema = new Schema(
    {
        brand: { type: String, required: true},
        type: { type: String, required: true },
        price: { type: Number, required: true},
        img: { type: String, required: true }
    },

    {
        timestamps: true
    }
);

const Peripherals = mongoose.model("peripherals", peripheralsSchema);

module.exports = Peripherals;
