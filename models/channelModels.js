const mongoose = require("mongoose");

const ChannelsSchema = new mongoose.Schema({
  name: String,
});

const channels = mongoose.model("channels", ChannelsSchema);

module.exports = channels;
