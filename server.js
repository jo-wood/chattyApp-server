// server.js
const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid/v1');
const  messages  = require('./message-db.js')
// Set the port to 3001
const PORT = 3001;
// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));
// Create the WebSockets server
const wss = new SocketServer({ server });
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

const clients = [];
const userColor = {};

function pickColor() {
  let colorOptions = ['#FF6F61', '#D69C2F', '#343148', '#7F4145', '#BD3D3A', '#766F57'];

  let optionLength = colorOptions.length;

  let pickRandom = Math.floor(Math.random() +1 ) * optionLength;
  let randomColor = colorOptions[pickRandom]
  return {randomColor};
}

function checkColor(username, currentUser){
  if (userColor.hasOwnProperty === username) {
    return userColor[username];
  } else if (userColor.hasOwnProperty === currentUser ){
    return userColor[currentUser];
  } else {
    let clientSpecColor = pickColor();
    userColor[currentUser] = clientSpecColor;
    return clientSpecColor;
  }
}


function addMessageToDb(newPost) {

  const { newMessage } = newPost;
  if (newMessage) {
    messages.push(newPost.newMessage);
    wss.broadcast({
      newMessage
    });
  } else {
    messages.push(newPost.nameNotify);
    const { nameNotify } = newPost;
    wss.broadcast({ nameNotify });
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

  // send an initial loading of messages 
  wss.broadcast({ initialLoad: messages });

console.log(messages)
  client.on('message', (msgData) => {
    const msg = JSON.parse(msgData);
    const nameChange = msg.nameNotify;
    if (nameChange) {
      let { oldName, currentUser } = nameChange;
      addMessageToDb({ nameNotify: 
        {oldName, currentUser, currentColor: checkColor(null, currentUser)}
      });
    } else {
      const { username, content } = msg.newMsg;
      const { currentUser } = msg;

      const renderMessage = {
        username: username,
        content: content,
        messageId: uuid(),
        nameColor: checkColor(username, currentUser)


      };
      addMessageToDb({ newMessage: renderMessage});
    }
  }); 



  client.on('close', () => {
    wss.broadcast({ numberOfUsers: wss.clients.size });
    console.log('Client disconnected');
  });

});




