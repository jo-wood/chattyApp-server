// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid/v1');
const  messages  = require('./message-db.js')
const PORT = 3001;
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));
// Create the WebSockets server
const wss = new SocketServer({ server });
const clients = [];
const userColor = {};

//* username color helper functions:

function pickColor() {
  let colorOptions = ['#FF6F61', '#D69C2F', '#343148', '#7F4145', '#BD3D3A', '#766F57'];
  let max = colorOptions.length - 1;
  let min = 0;
  let pickRandom = Math.random() * (max - min) + min
  let randomColor = colorOptions[Math.floor(pickRandom)]
  return randomColor;
}

function checkColor(user){
  if (userColor[user]) {
    console.log(user)
    return userColor[user];
  } else {
    let clientSpecColor = pickColor();
    userColor[user] = clientSpecColor;
    console.log(userColor)
    return clientSpecColor;
  }
}

//* push posts to temporary db

function addMessageToDb(newPost) {
  const { newMessage, nameNotify  } = newPost;
  if (nameNotify) {
    messages.push(nameNotify);
    wss.broadcast({
      nameNotify
    });
  } else {
    messages.push(newMessage);
    wss.broadcast({
      newMessage
    });
  }
}

SocketServer.prototype.broadcast = (msg) => {
  clients.map((c) => {
    c.send(JSON.stringify(msg));
  });
}

wss.on('connection', (client) => {
  clients.push(client);
  wss.broadcast({ numberOfUsers: wss.clients.size});
  // send an initial loading of messages for refresh per session
  wss.broadcast({ initialLoad: messages });
  // check which type of message client sending
  client.on('message', (msgData) => {
    const msg = JSON.parse(msgData);
    const nameChange = msg.nameNotify;
    // if post is a notification of a name change:
    if (nameChange) {
      const { oldName, currentUser } = nameChange;
      addMessageToDb({ 
        nameNotify: {
          oldName, 
          currentUser
        }
      });
    } else {
      // consider the post a newMessage
      const { username, content } = msg.newMsg;
      const { currentUser } = msg;
      const renderMessage = {
        username: username,
        content: content,
        messageId: uuid(),
        nameColor: checkColor(username)
      };
      addMessageToDb({ newMessage: renderMessage});
    }
  }); 

  client.on('close', () => {
    wss.broadcast({ numberOfUsers: wss.clients.size });
    console.log('Client disconnected');
  });
});