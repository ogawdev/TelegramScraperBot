const { Scenes } = require("telegraf");
const config = require("../config");
// const login = require("../utils/node-storage");
const client = require("../utils/node-storage");
const app = require("./checkLogin");
const scene = new Scenes.BaseScene("login");

async function login() {
  const { phone_code_hash } = await client("auth.sendCode", {
    phone_number: config.telegram.phone,
    sms_type: 5,
    current_number: true,
    api_id: config.api_id,
    api_hash: config.api_hash,
  });

  return phone_code_hash;
}

scene.enter(async (ctx) => {
  let { phone_code_hash } = await login();
  console.log(phone_code_hash);

  ctx.session.phone_code_hash = phone_code_hash;

  ctx.reply(`Your code: ${config.telegram.phone}`);
});

scene.on("text", async (ctx) => {
  const phone_code = ctx.message.text;
  const phone_code_hash = ctx.session.phone_code_hash;
  console.log(phone_code, ctx.session.phone_code_hash);

  const { user } = await client("auth.signIn", {
    phone_number: config.telegram.phone,
    phone_code_hash: phone_code_hash,
    phone_code: phone_code,
  });

  app.storage.set("signedin", true);
  ctx.reply("signed in successfully", user);
});

module.exports = scene;
