const { Scenes, Markup } = require("telegraf");
const { toUnixDate } = require("../utils/init");

const scene = new Scenes.BaseScene("date");

scene.enter(async (ctx) => {
  ctx.reply(
    ctx.i18n.t("send_time"),
    Markup.keyboard([ctx.i18n.t("back")]).resize()
  );

  scene.hears(ctx.i18n.t("back"), (ctx) => ctx.scene.enter("link"));

  scene.on("text", async (ctx) => {
    let result = toUnixDate(ctx.message.text);

    if (!result) {
      ctx.reply(`❌Xato format`);
      return;
    }

    ctx.session.date = result;
    ctx.scene.enter("search");
  });
});

module.exports = scene;
