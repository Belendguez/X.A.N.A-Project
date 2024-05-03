const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  specialPoints: { type: Number, default: 10 },
  money: { type: Number, default: 20 },
  dailyLastUsed: { type: Number, default: 0 },
  // Nuevo campo para el inventario
  inventory: {
    type: [
      {
        item: { type: String, required: true },
        quantity: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
});

const model = mongoose.model("xanadb", profileSchema);

module.exports = model;
