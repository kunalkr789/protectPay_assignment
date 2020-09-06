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
<<<<<<< HEAD
    lastTrans: {
      type: Number,
=======

    Date: {
      type: String,
>>>>>>> af2a9756cdb3c3767dbdcb4ad6c6859bbf87b84c
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
