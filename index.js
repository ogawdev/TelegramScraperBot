const { Telegraf } = require("telegraf");
const { TOKEN } = require("./config");
const session = require("./code/session");
const stage = require("./scenes");
const path = require("path");

const bot = new Telegraf("1215151699:AAHJ_7eyE2hWX3OUwAATiYN4PBbfYmXfio4");
// ?Storage get telegram.json
const { Storage } = require("mtproto-storage-fs");
const telegram = require("./utils/init");
const app = {
  storage: new Storage("telegram.json"),
};

// middlewares
bot.use(session);
bot.use(stage.middleware());

// Error handling
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(async (ctx) => {
  // await checkLogin();
  ctx.reply("Assalomu alaykum bu bot orqali kanallarni kuzatishingiz mumkin");

  if (!(await app.storage.get("signedin"))) {
    ctx.reply("Please login the telegram with set.js");
    return;
  }
  // const dialogs = await telegram("messages.getDialogs");
  // const { chats } = dialogs;
  // console.log(chats);

  // const dialogs = await telegram("messages.getDialogs", {
  //   limit: 100,
  // });
  // console.log(dialogs.dialogs);
  const link = "https://t.me/itspecuz";
  const regex = /(https:\/\/t.me\/)(\w+)/;
  const match = link.match(regex);
  const username = match[2];
  const resolveUsernameResult = await telegram("contacts.resolveUsername", {
    username,
  });

  const channel = resolveUsernameResult.chats[0];
  const channelId = channel.id;
  const accessHash = channel.access_hash;

  const date = new Date("2023-02-12"); // Replace with the desired date
  const minDate = Math.floor(date.getTime() / 1000);
  console.log(minDate);
  const result = await telegram("messages.search", {
    peer: {
      _: "inputPeerChannel",
      channel_id: channelId,
      access_hash: accessHash,
    },
    q: "",
    // filter: { _: "inputMessagesFilterDate" },
    min_date: minDate,
    max_date: minDate + 86400,
    offset_id: 0,
    add_offset: 0,
    limit: 10,
    max_id: 0,
    min_id: 0,
    hash: 0,
  });

  const messages = result.messages;
  console.log(messages);
  // const joinChannelResult = await telegram("channels.joinChannel", {
  //   channel: {
  //     _: "inputChannel",
  //     channel_id: channelId,
  //     access_hash: accessHash,
  //   },
  // });

  // console.log(joinChannelResult);
});

module.exports = bot;
