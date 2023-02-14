const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("menu");

scene.enter(async (ctx) => {
  const text = ctx.i18n.t("menu_home");
  ctx.reply(
    text,
    Markup.keyboard([
      [ctx.i18n.t("search")],
      [ctx.i18n.t("contact"), ctx.i18n.t("settings")],
    ])
      .resize()
  );

  // Move the scene.hears() callbacks here, inside the scene.enter() callback
  scene.hears(ctx.i18n.t("search"), (ctx) => ctx.scene.enter("link"));
  scene.hears(ctx.i18n.t("contact"), (ctx) =>
    ctx.reply(`☎️${ctx.i18n.t("contact")}\n\n📞+998905210501\n✅@ogaw_uz`)
  );
  scene.hears(ctx.i18n.t("settings"), (ctx) => ctx.scene.enter("settings"));
});

module.exports = scene;
