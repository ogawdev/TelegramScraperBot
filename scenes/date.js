const { Scenes } = require("telegraf");
const telegram = require("../utils/init");

const scene = new Scenes.BaseScene("date");

scene.enter(async (ctx) => {
  ctx.reply("Vaqtni quyidagi ko'rinishda kiriting \n2023.02.13");
});

scene.on("text", async (ctx) => {
  //   ctx.scene.leave()
  //   return
  //   ctx.session.date = ctx.message.text;
  let text = ctx.message.text.replace(".", "-");
  const link = ctx.session.link;
  const regex = /(https:\/\/t.me\/)(\w+)/;
  const match = link.match(regex);
  const username = match[2];
  const resolveUsernameResult = await telegram("contacts.resolveUsername", {
    username,
  });

  const channel = resolveUsernameResult.chats[0];
  const channelId = channel.id;
  const accessHash = channel.access_hash;

  const date = new Date(ctx.message.text); // Replace with the desired date
  const minDate = Math.floor(date.getTime() / 1000);
  console.log(minDate);
  const result = await telegram("messages.search", {
    peer: {
      _: "inputPeerChannel",
      channel_id: channelId,
      access_hash: accessHash,
    },
    q: "",
    // filter: { _: "messageService" },
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
//   console.log(messages);
  let counter = 0;
  const interval = setInterval(() => {
    if (counter >= 10) {
      clearInterval(interval);
      return;
    }
    if (messages[counter]._ == "messageService") {
      counter++;
      return;
    }
    ctx.reply(
      `${
        messages[counter].message ||
        messages[counter]?.media?.caption ||
        messages[counter].id
      }`
    );
    counter += 1;
  }, 1000);
});

module.exports = scene;
