const { Scenes, Markup } = require("telegraf");
const telegram = require("../utils/client");

const scene = new Scenes.BaseScene("link");

scene.enter(async (ctx) => {
  ctx.reply(
    `${ctx.i18n.t("enter_channel")}\nhttps://t.me/username`,
    Markup.keyboard([ctx.i18n.t("back")]).resize()
  );

  scene.hears(ctx.i18n.t("back"), (ctx) => ctx.scene.enter("menu"));
  scene.hears(ctx.i18n.t("search_by_date"), (ctx) => ctx.scene.enter("date"));

  scene.on("text", async (ctx) => {
    ctx.reply(ctx.i18n.t("wait"));

    ctx.session.link = ctx.message.text;

    const parts = ctx.message.text.split("/");
    const username = parts[parts.length - 1];

    try {
      const resolveUsernameResult = await telegram("contacts.resolveUsername", {
        username,
      });

      ctx.session.channel = {
        username,
        channelId: resolveUsernameResult.chats[0].id,
        accessHash: resolveUsernameResult.chats[0].access_hash,
      };

      // ctx.scene.enter("")

      ctx.reply(
        `${ctx.i18n.t("channel_found")}✅\n\nTitle: ${
          resolveUsernameResult.chats[0].title
        }\nId: ${resolveUsernameResult.chats[0].id}\nUsername: @${
          resolveUsernameResult.chats[0].username
        }`,
        Markup.keyboard([
          ctx.i18n.t("search_by_date"),
          ctx.i18n.t("back"),
          // "Barcha postlarni yuklab olish",
        ]).resize()
      );
    } catch (e) {
      ctx.reply(ctx.i18n.t("channel_not_found"));
    }
  });
});

module.exports = scene;
