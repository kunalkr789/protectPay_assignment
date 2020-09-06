const mongoose = require("mongoose");

//to connect and give name to the database
mongoose.connect("mongodb://127.0.0.1/protectPay");


//to aquire the connection in the database
const db = mongoose.connection;


//checked the error in database 
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));


//run the database if it hasn't an error
db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

module.exports = db;


