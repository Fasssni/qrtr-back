const ws = require("ws");

const db = require("../Models");

const wss = new ws.Server({
  port: process.env.WSSport,
});

wss.on("connection", function connection(ws) {
  console.log("Connection established");
  ws.on("message", function (message) {
    try {
      message = JSON.parse(message);
      ws.id = message.user_id;
      console.log("it did work");
      switch (message.method) {
        case "message":
          handleClientMessage(message);
          break;
        case "chat-connection":
          getUserChat(message);
          break;
        case "conversations":
          handleConversations(message.user_id);
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

async function getUserChat({ user_id, conversation_id }) {
  const conversation = await db.conversations.findOne({
    where: {
      id: conversation_id,
    },
  });

  if (conversation && conversation.user_id !== user_id) {
    return;
  }

  const messages = await db.message.findAll({
    where: {
      conversation_id: conversation_id,
    },
  });
  wss.clients.forEach((client) => {
    if (client.id === user_id) {
      client.send(
        JSON.stringify({ method: "chat-connection", messageData: messages })
      );
    }
  });
}

function handleClientMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

async function handleConversations(user_id) {
  const conversations = await db.conversations.findAll({
    where: {
      user_id: user_id,
    },
  });

  wss.clients.forEach((client) => {
    if (user_id === client.id) {
      client.send(JSON.stringify({ method: "conversations", conversations }));
    }
  });
}

module.exports = wss;
