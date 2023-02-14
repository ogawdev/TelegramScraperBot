const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("settings");

scene.enter(async (ctx) => {
  ctx.replyWithHTML(
    "⚙️<b>Sozlamalar</b>\n\n🇺🇿Tilni tanlang\n🇺🇸Select a language\n🇷🇺Выберите язык",
    Markup.keyboard([["🇺🇿", "🇺🇸", "🇷🇺"], [ctx.i18n.t("back")]]).resize()
  );
});

scene.hears("⬅️Ortga", (ctx) => ctx.scene.enter("menu"));
scene.hears("🇺🇿", (ctx) => {
  ctx.i18n.locale("uz");
  ctx.reply(ctx.i18n.t("lang_changed"))
  ctx.scene.enter("menu");
});
scene.hears("🇺🇸", (ctx) => {
  ctx.i18n.locale("en");
  ctx.reply(ctx.i18n.t("lang_changed"));
  ctx.scene.enter("menu");
});
scene.hears("🇷🇺", (ctx) => {
  ctx.i18n.locale("ru");
  ctx.reply(ctx.i18n.t("lang_changed"));
  ctx.scene.enter("menu");
});

module.exports = scene;
