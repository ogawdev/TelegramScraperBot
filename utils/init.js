const telegram = require("./client");

async function getAllMessages(channelId, accessHash, limit = 100000) {
  // * Get all messages channel
  let allMessages = [];
  let offsetId = 0;

  while (true) {
    const result = await telegram("messages.getHistory", {
      peer: {
        _: "inputPeerChannel",
        channel_id: channelId,
        access_hash: accessHash,
      },
      limit: 100,
      offset_id: offsetId,
      add_offset: 0,
      max_id: 0,
      min_id: 0,
      hash: 0,
    });

    const messages = result.messages;

    if (!messages.length) {
      break;
    }

    allMessages = allMessages.concat(messages);
    offsetId = messages[messages.length - 1].id;
  }

  return allMessages;
}

function filteredDateMessages(text, allMessages, ctx) {
  if (text.length == 10) {
    const desiredDate = new Date(text);

    console.log(allMessages.length);
    console.log(
      allMessages.filter((message) => {
        const messageDate = new Date(message.date * 1000);
        return messageDate.toDateString() === desiredDate.toDateString();
      })
    );
    return allMessages.filter((message) => {
      const messageDate = new Date(message.date * 1000);
      return messageDate.toDateString() === desiredDate.toDateString();
    });
  } else if (text.length == 21) {
    const startDate = new Date(text.split(":")[0]);
    const endDate = new Date(text.split(":")[1]);

    return allMessages.filter((message) => {
      const messageDate = new Date(message.date * 1000);
      return messageDate >= startDate && messageDate <= endDate;
    });
  } else {
    ctx.reply("Sana xato kiritildi");
    return;
  }
}

async function sendMessages(messages, ctx) {
  //Send posts
  let counter = 0;
  const interval = setInterval(() => {
    if (counter >= messages.length) {
      clearInterval(interval);
      return;
    }
    // messages[counter]?._ == "messageService"
    if (!(messages[counter]?.message || messages[counter]?.media?.caption)) {
      counter++;
      return;
    }
    ctx.reply(
      `${
        messages[counter].message ||
        messages[counter]?.media?.caption ||
        messages[counter].id
      }\nDate: ${new Date(messages[counter].date * 1000)}`
    );
    counter += 1;
  }, 1000);
}

//   Excel create
async function writeExel(messages) {
  let xl = require("excel4node");
  let wb = new xl.Workbook();
  const ws = wb.addWorksheet("Sheet 1");

  ws.cell(1, 1).string("№");
  ws.cell(1, 2).string("Channel_id");
  ws.cell(1, 3).string("Text");
  ws.cell(1, 4).string("Views");

  for (let i = 0; i < messages.length; i++) {
    ws.cell(i + 2, 1).number(i + 1);
    ws.cell(i + 2, 2).string(`${messages[i].to_id.channel_id}`);
    ws.cell(i + 2, 3).string(`${messages[i].message}`);
    ws.cell(i + 2, 4).string(`${messages[i].views}`);
  }

  ws.column(1).setWidth(5);
  ws.column(4).setWidth(100);

  try {
    await wb.write("Excel.xlsx");
    return true;
  } catch (e) {
    return false;
  }
}

function searchMessages(messages, word) {
  const result = messages.filter((message) =>
    message.message?.toLowerCase().includes(word)
  );
  return result.length > 0 ? result : false;
}

module.exports = {
  getAllMessages,
  filteredDateMessages,
  sendMessages,
  writeExel,
  searchMessages,
};
