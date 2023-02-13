const { Scenes } = require("telegraf");
const Path = require("path");
const { MTProto } = require("telegram-mtproto");
const { Storage } = require("mtproto-storage-fs");
const readline = require("readline");
const appconfig = require("../config");

// The api_id and api_hash values can be obtained here: https://my.telegram.org/
const config = {
  phone_number: appconfig.telegram.phone,
  api_id: parseInt(appconfig.telegram.id, 10),
  api_hash: appconfig.telegram.hash,
};

const app = {
  storage: new Storage(appconfig.telegram.storage),
};

const phone = {
  num: config.phone_number,
};

const api = {
  layer: 57,
  initConnection: 0x69796de9,
  api_id: config.api_id,
};

const server = {
  dev: appconfig.telegram.devServer,
};

const client = MTProto({ server, api, app });

const scene = new Scenes.BaseScene("check_login");

scene.enter(async (ctx) => {
  console.log(await app.storage.get("signedin"));
  if (!(await app.storage.get("signedin"))) {
    console.log(true);
    await client("auth.sendCode", {
      phone_number: phone.num,
      sms_type: 5,
      current_number: true,
      api_id: config.api_id,
      api_hash: config.api_hash,
    });
  } else {
    console.log("already signed in");
    ctx.reply("already signed in");
  }
});

module.exports = scene;
