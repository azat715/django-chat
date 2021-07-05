// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () { };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

function showHtml(message, callback) {
  const divMesItem = document.createElement('li');
  divMesItem.className = 'list-group-item';
  if (typeof callback == 'function') {
    callback(divMesItem);
  } else {
    divMesItem.innerText = message;
  }
  resFrame.appendChild(divMesItem);
}


function connWebSocket() {
  const socket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/test_room/'
  );
  socket.onopen = () => {
    console.log('CONNECTED');
    socket.send(
      JSON.stringify({ 'command': 'old_messages' })
    );
    console.log('sendend');
  };
  socket.onclose = () => {
    console.log('DISCONNECTED');
  };
  function send(message) {
    if (socket.readyState == 1) {
      socket.send(message);
    } else {
      console.log(socket.readyState);
      console.log('CONNECT ERROR');
      alert('Ошибка, смотрите логи');
    }
  }
  function close() {
    socket.close();
    console.log('CLOSE');
  }
  socket.onmessage = (message) => {
    showHtml(message, (divMesItem) => {
      let data_raw = JSON.parse(message.data)
      let data = data_raw.message
      console.log(data)
      const cardTitle = document.createElement('h5');
      cardTitle.classList.add("card-title");
      cardTitle.innerText = data.username
      const cardSubtitle = document.createElement('h6');
      cardSubtitle.classList.add("card-subtitle");
      cardSubtitle.innerText = data.date
      const cardText = document.createElement('p');
      cardText.classList.add("card-text");
      cardText.innerText = data.message
      const Card = document.createElement('div');
      Card.className = 'card';
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      Card.appendChild(cardBody)
      cardBody.appendChild(cardTitle)
      cardBody.appendChild(cardSubtitle)
      cardBody.appendChild(cardText)
      divMesItem.appendChild(Card)
    });
  };


  return {
    send: send,
    close: close,
  };
}


const btnSend = document.getElementById('chat-message-submit');
const inputField = document.getElementById('chat-message-input');
const resFrame = document.getElementById('chat-res');

document.addEventListener('DOMContentLoaded', () => {
  const wsSocket = connWebSocket();
  // wsSocket.send(JSON.stringify({ 'command': 'old_messages' }));
  btnSend.addEventListener('click', () => {
    // showHtml(inputField.value);
    wsSocket.send(
      JSON.stringify({ 'message': inputField.value })
    );
    inputField.value = '';
  });
});