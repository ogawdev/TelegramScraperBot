const { Telegraf } = require("telegraf");
const { TOKEN } = require("./config");
const session = require("./code/session");
const stage = require("./scenes");
const { Storage } = require("mtproto-storage-fs");
const { mongo } = require("./models/mongo");
const I18n = require("telegraf-i18n")


const i18n = new I18n({
  directory: __dirname + "/locales", 
  defaultLanguage: "uz",
  useSession: true,
  allowMissing: false,
  fallbackToDefaultLanguage: true,
});

// databases
(async () => {
  await mongo();
})();

const bot = new Telegraf(TOKEN);

// ?Storage get telegram.json
const app = {
  storage: new Storage("telegram.json"),
};



// middlewares
bot.use(session);
bot.use(i18n.middleware());
bot.use(stage.middleware());

// Error handling
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(async (ctx) => {
  if (!(await app.storage.get("signedin"))) {
    ctx.reply("Please login the telegram with set.js");
    return;
  }

  ctx.scene.enter("menu");
});

bot.hears("🔍Search", (ctx) => {
  ctx.scene.enter("link");
});

module.exports = bot;
