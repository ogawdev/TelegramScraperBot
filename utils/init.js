const telegram = require("./client");

async function getAllMessages(
  channelId,
  accessHash,
  receivedDate,
  limit = 100
) {
  try {
    // * Get all messages channel
    let allMessages = [];
    let offsetId = 0;
    let messageCount = 0;

    while (true) {
      const result = await telegram("messages.getHistory", {
        peer: {
          _: "inputPeerChannel",
          channel_id: channelId,
          access_hash: accessHash,
        },
        limit: limit,
        offset_id: offsetId,
        add_offset: 0,
        max_id: 0,
        min_id: 0,
        hash: 0,
      });

      const messages = result.messages;

      allMessages = allMessages.concat(messages);

      if (
        !messages.length ||
        messages[messages.length - 1].date < receivedDate
      ) {
        break;
      }
      offsetId = messages[messages.length - 1].id;
      messageCount += messages.length;
    }
   
    return allMessages;
  } catch (e) {
    return false;
  }
}

async function filteredDateMessages(startDate, endDate, messages) {
  return messages.filter((message) => {
    const messageDate = message.date;
    return messageDate >= startDate && messageDate <= endDate;
  });
}

function toUnixDate(time) {
  const regex = /^(\d{4})\.(\d{2})\.(\d{2}):(\d{4})\.(\d{2})\.(\d{2})$/;
  const match = time.match(regex);

  if (!match) {
    return false;
  }

  const startDate = Date.parse(`${match[1]}-${match[2]}-${match[3]}`) / 1000;
  const endDate = Date.parse(`${match[4]}-${match[5]}-${match[6]}`) / 1000;

  if (isNaN(startDate) || isNaN(endDate)) {
    return false;
  } else {
    return { startDate, endDate };
  }
}

async function sendMessages(messages, ctx) {
  const filteredMessages = messages.filter(
    (msg) => msg.message || msg.media?.caption
  );

  for (const msg of filteredMessages) {
    await ctx.reply(
      `${msg.message || msg.media?.caption || msg.id}\nDate: ${new Date(
        msg.date * 1000
      )}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait 1 second before sending the next message
  }
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
  const filteredMessages = messages.filter(
    (msg) => msg.message || msg.media?.caption
  );
  for (let i = 0; i < filteredMessages.length; i++) {
    ws.cell(i + 2, 1).number(i + 1);
    ws.cell(i + 2, 2).string(`${filteredMessages[i].to_id.channel_id}`);
    ws.cell(i + 2, 3).string(
      `${filteredMessages[i]?.message || filteredMessages[i]?.media?.caption}`
    );
    ws.cell(i + 2, 4).string(`${filteredMessages[i].views}`);
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
  console.log(messages)
  const result = messages.filter(
    (message) =>
      message.message?.toLowerCase().includes(word) ||
      message.media?.caption?.toLowerCase().includes(word)
  );
  return result.length > 0 ? result : false;
}

module.exports = {
  getAllMessages,
  filteredDateMessages,
  sendMessages,
  writeExel,
  searchMessages,
  toUnixDate,
};
