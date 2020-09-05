const mongoose = require("mongoose");

const payeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    account_number: {
      type: Number,
      unique: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Payee = mongoose.model("Payee", payeeSchema);

module.exports = Payee;
