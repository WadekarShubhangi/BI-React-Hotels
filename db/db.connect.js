const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("connected");
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

module.exports = { initializeDatabase };
