// mongod.js
const mongoose = require("mongoose");

exports.Mongod = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017", {
      dbName: "UserAuth",
    })
    .then(() => {
      console.log("Database Connected!!");
    })
    .catch((e) => console.log(e));
};
