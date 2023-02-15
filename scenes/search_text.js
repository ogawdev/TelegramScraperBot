const { Scenes, Markup } = require("telegraf");
const path = require("path");
const fs = require("fs");
const {
  getAllMessages,
  filteredDateMessages,
  searchMessages,
  sendMessages,
  writeExel,
} = require("../utils/init");

const scene = new Scenes.BaseScene("search_text");

scene.enter(async (ctx) => {
  ctx.reply(
    ctx.i18n.t("send_word"),
    Markup.keyboard([ctx.i18n.t("back")]).resize()
  );

  scene.hears(ctx.i18n.t("back"), (ctx) => ctx.scene.enter("search"));

  scene.on("text", async (ctx) => {
    ctx.reply(ctx.i18n.t("wait"));

    let { startDate, endDate } = ctx.session.date;

    const channelId = ctx.session.channel.channelId;
    const accessHash = ctx.session.channel.accessHash;

    const allMessages = await getAllMessages(
      channelId,
      accessHash,
      startDate,
      100
    );

    const date = ctx.message.text;

    if (allMessages.length == 0) {
      ctx.reply(`❌${date} ${ctx.i18n.t("no_messages")}`);
      ctx.scene.enter("date");
      return;
    }

    let filteredMessages = await filteredDateMessages(
      startDate,
      endDate,
      allMessages
    );

    if (filteredMessages?.length == 0) {
      ctx.reply(`❌${date} ${ctx.i18n.t("no_messages")}`);
      ctx.scene.enter("date");
      return;
    }

    const { text } = ctx.message;

    let searchResult = searchMessages(filteredMessages, text);

    if (!searchResult) {
      ctx.reply(`${text} ${ctx.i18n.t("no_posts_found")}`);
      return;
    }

    await sendMessages(searchResult, ctx);

    let result = await writeExel(searchResult);
    if (result) {
      let file_path = path.join(__dirname, "..", "Excel.xlsx");
      await ctx.replyWithDocument({
        source: file_path,
        filename: "Excel.xlsx",
      });
    }
  });
});

module.exports = scene;
