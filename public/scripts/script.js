let button = document.getElementById("send");
let output = document.getElementById("output");
let message = document.getElementById("message");
let handle = document.getElementById("handle");
let feedback = document.getElementById("typing-area");
const socket = io.connect("http://localhost:3000");
socket.emit("new", {
  new: handle.value,
});
function timeoutFunction() {
  socket.emit("typing", false);
}
button.addEventListener("click", () => {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
  });
  message.value = "";
});

socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
});
socket.on("discon", (data) => {
  output.innerHTML += "<p><em>" + data.user + " has disconnected</p>";
});
socket.on("new", (data) => {
  output.innerHTML += "<p><em>" + data.new + " has connected</p>";
});
message.addEventListener("keyup", () => {
  socket.emit("typing", handle.value);
  clearTimeout(timeout);
  var timeout = setTimeout(timeoutFunction, 2000);
});
socket.on("typing", (data) => {
  if (data) {
    feedback.innerHTML = "<p><em>" + data + " is typing...</em></p>";
  } else {
    feedback.innerHTML = "";
  }
});
