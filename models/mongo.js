const mongoose = require("mongoose");

require("./channelModels");

module.exports.mongo = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect("mongodb://127.0.0.1:27017/scraperbot");
    console.log("MONGO CONNECT");
  } catch (e) {
    console.log("MONGO ERROR" + e);
  }
};
