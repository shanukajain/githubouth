const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// require("dotenv").config();

const connection = mongoose.connect("mongodb+srv://QRBot:QRBot@qrbot.oagp3ux.mongodb.net/QRBot?retryWrites=true&w=majority");

module.exports = {
  connection,
};