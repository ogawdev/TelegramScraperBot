const { Scenes, Markup } = require("telegraf");
const telegram = require("../utils/client");
const { getAllMessages, filteredDateMessages } = require("../utils/init");

const scene = new Scenes.BaseScene("date");

scene.enter(async (ctx) => {
  ctx.reply(
    ctx.i18n.t("send_time"),
    Markup.keyboard([ctx.i18n.t("back")]).resize()
  );

  scene.hears(ctx.i18n.t("back"), (ctx) => ctx.scene.enter("link"));

  scene.on("text", async (ctx) => {
    ctx.reply(ctx.i18n.t("wait"))
    const channelId = ctx.session.channel.channelId;
    const accessHash = ctx.session.channel.accessHash;

    const allMessages = await getAllMessages(channelId, accessHash);

    const date = ctx.message.text;
    let filteredMessages = filteredDateMessages(date, allMessages, ctx);

    if (filteredMessages?.length == 0) {
      ctx.reply(`❌${date} ${ctx.i18n.t("no_messages")}`);
      return;
    }

    ctx.session.date = ctx.message.text;
    ctx.scene.enter("search");
  });
});

module.exports = scene;
