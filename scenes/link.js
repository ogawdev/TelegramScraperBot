const { Scenes } = require("telegraf");

const scene = new Scenes.BaseScene("link");

scene.enter(async (ctx) => {
  ctx.reply(
    "Telegram kanla linkini quyidagicha kiriting\nhttps://t.me/username"
  );
});

scene.on("text", async (ctx) => {
  ctx.session.link = ctx.message.text;
  ctx.scene.enter("date");
});

module.exports = scene;
