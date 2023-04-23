const express = require("express");
const app = express();

const { connection } = require("./config/db");




app.listen(4500, async () => {
    try {
      await connection;
      console.log("Connected to DB");
      console.log(`http://localhost:4500/`);
    } catch (error) {
      console.log("Error in Connecting to DB");
    }
  });