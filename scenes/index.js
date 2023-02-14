const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
  require("./date"),
  require("./link"),
  require("./search"),
  require("./search_text"),
  require("./menu"),
  require("./settings"),
]);

module.exports = stage;
