const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
  require("./login"),
  require("./date"),
  require("./link"),
]);

module.exports = stage;
