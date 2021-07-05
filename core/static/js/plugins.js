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


const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/chat/'
  + roomName
  + '/'
);

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  console.log(data)
  if (Array.isArray(data["message"])) {
    console.log("Array")
    data["message"].forEach((item) => {
      console.log(item)
      document.querySelector('#chat-log').value += (item + '\n');
    })
  } else {
    console.log("not Array")
    document.querySelector('#chat-log').value += (data.message + '\n');
  }
};

chatSocket.onclose = function (e) {
  console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function (e) {
  if (e.keyCode === 13) {  // enter, return
    document.querySelector('#chat-message-submit').click();
  }
};

document.querySelector('#chat-message-submit').onclick = function (e) {
  const messageInputDom = document.querySelector('#chat-message-input');
  const message = messageInputDom.value;
  chatSocket.send(JSON.stringify({
    'message': message
  }));
  messageInputDom.value = '';
};

document.querySelector('#chat-message-prev').onclick = function (e) {
  chatSocket.send(JSON.stringify({
    'command': 'old_messages'
  }));
};