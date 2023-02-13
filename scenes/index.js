const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([require("./checkLogin"), require("./login")]);

module.exports = stage;
