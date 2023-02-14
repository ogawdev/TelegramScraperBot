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
  ctx.reply(ctx.i18n.t("send_word"), Markup.keyboard([ctx.i18n.t("back")]).resize());

  scene.hears("⬅️Ortga", (ctx) => ctx.scene.enter("search"));

  scene.on(ctx.i18n.t("back"), async (ctx) => {
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

    const { text } = ctx.message;

    let searchResult = searchMessages(filteredMessages, text);

    if (searchResult.length == 0) {
      ctx.reply(`${text} ${ctx.i18n.t("no_posts_found")}`);
      return;
    }

    await sendMessages(searchResult, ctx);

    let result = await writeExel(searchResult);
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
