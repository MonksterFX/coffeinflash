var socket = null;
var storage = window.localStorage;

function getCurrentRoom() {
  var currentLocation = new URL(location);
  return currentLocation.pathname.substr(1);
}

function getCurrentUserAlias() {
  return storage.getItem('userAlias');
}

function setCurrentUserAlias(alias) {
  storage.setItem('userAlias', alias);
}

function chatSendMessage(msg) {
  alert('dwdwd')
  socket.emit('new-message', msg);
  addMessage(msg);
}

function chatEnter() {
  socket = io('http://localhost:3000', {
    query: { user: getCurrentUserAlias(), room: getCurrentRoom() },
  });

  socket.on('connect', () => {
    console.log('socket connected: ' + socket.connected); // true
  });

  socket.on('disconnect', () => {
    console.log('socket connected: ' + socket.connected); // false
  });

  socket.on('chat-message', (msg) => {
    addMessage(msg, true);
  });
}

function addMessage(msg, others = false) {
  var chat = document.getElementById('chat');
  var newMessage = document.createElement('p');
  newMessage.innerText = msg;
  newMessage.classList.add('cc-message');
  newMessage.classList.add(others ? 'cc-others' : 'cc-me');
  chat.appendChild(newMessage);
}

// the user has no alias, let them set one
if (!getCurrentUserAlias()) {
  setCurrentUserAlias(window.prompt('which user name do you want to use'));
}

// enter the chat automaticlly
chatEnter();
