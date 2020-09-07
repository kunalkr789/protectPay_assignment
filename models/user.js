const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique:true
    },
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    account_number: {
      type: Number,
      unique: true,
    },
    term: {
      type: String,
    },
    lastTrans: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
