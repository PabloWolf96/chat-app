const express = require("express");
const app = express();
const server = require("http").Server(app);
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
let users = {};
app.set("view engine", "ejs");
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/auth", (req, res) => {
  if (Object.values(users).includes(req.body.username)) {
    res.render("index", {
      err:
        "The username is already taken find another or wait for them to go offline",
    });
  } else {
    req.session.user = req.body.username;
    res.redirect("/chat");
  }
});
app.get("/chat", (req, res) => {
  if (req.session.user) {
    res.render("chat", { username: req.session.user });
  } else {
    res.send("<h1>Access Denied</h1>");
  }
});

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("new", (data) => {
    socket.broadcast.emit("new", data);
    users[socket.id] = data.new;
  });
  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
    socket.user = data.handle;
    console.log(socket.user);
    console.log(data.handle);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  socket.on("disconnect", () => {
    io.sockets.emit("discon", {
      user: users[socket.id],
    });
    delete users[socket.id];
  });
});
server.listen(PORT, () => console.log("Server is running...."));
