const { Scenes, Markup } = require("telegraf");
const path = require("path");
const fs = require("fs");
const {
  getAllMessages,
  filteredDateMessages,
  sendMessages,
  writeExel,
} = require("../utils/init");

const scene = new Scenes.BaseScene("search");

scene.enter(async (ctx) => {
  ctx.reply(
    ctx.i18n.t("choose_one"),
    Markup.keyboard([
      ctx.i18n.t("search"),
      ctx.i18n.t("load_all_posts"),
      ctx.i18n.t("back"),
    ]).resize()
  );

  scene.hears(ctx.i18n.t("back"), (ctx) => ctx.scene.enter("date"));

  scene.hears(ctx.i18n.t("search"), (ctx) => ctx.scene.enter("search_text"));

  scene.hears(ctx.i18n.t("load_all_posts"), async (ctx) => {
    ctx.reply(ctx.i18n.t("wait"));

    let { startDate, endDate } = ctx.session.date;
    console.log(startDate, endDate);

    ctx.reply(ctx.i18n.t("wait"));
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

    await sendMessages(filteredMessages, ctx);

    let result = await writeExel(filteredMessages);
    if (result) {
      let file_path = path.join(__dirname, "..", "Excel.xlsx");
      await ctx.replyWithDocument({ source: file_path, filename: "Excel.xlsx" });
    }
  });
});

module.exports = scene;
