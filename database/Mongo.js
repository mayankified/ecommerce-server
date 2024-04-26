// mongod.js
const mongoose = require("mongoose");

exports.Mongod = () => {
  mongoose
    .connect("mongodb+srv://mayanklander:abcdefgh@ecommm.yz5gtge.mongodb.net/?retryWrites=true&w=majority", {
      dbName: "UserAuth",
    })
    .then(() => {
      console.log("Database Connected!!");
    }) 
    .catch((e) => console.log(e));
};
