// mongod.js
const mongoose = require("mongoose");

exports.Mongod = () => {
  mongoose
    .connect("mongodb+srv://mayanklander:Z4SimtdSmzaJ3et4@ecommm.yz5gtge.mongodb.net/?retryWrites=true&w=majority", {
      dbName: "UserAuth",
    })
    .then(() => {
      console.log("Database Connected!!");
    }) 
    .catch((e) => console.log(e));
};
