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

    const channelId = ctx.session.channel.channelId;
    const accessHash = ctx.session.channel.accessHash;

    const allMessages = await getAllMessages(channelId, accessHash);

    const date = ctx.session.date;
    let filteredMessages = filteredDateMessages(date, allMessages, ctx);

    if (filteredMessages.length == 0) {
      ctx.reply(`${date} vaqtda xabarlar mavjud emas`);
      return;
    }

    console.log(filteredMessages);

    await sendMessages(filteredMessages, ctx);

    let result = await writeExel(filteredMessages);
    if (result) {
      let file_path = path.join(__dirname, "..", "Excel.xlsx");
      fs.readFile(file_path, { encoding: "utf-8" }, function (err, data) {
        if (!err) {
          ctx.replyWithDocument({ source: file_path, filename: "Excel.xlsx" });
        } else {
          console.log(err);
          ctx.reply(err + "");
        }
      });
    }
  });
});

module.exports = scene;
