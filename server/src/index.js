require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { s3 } = require("../s3config");

const v1RouterEmployees = require("./employees/v1/routes/index.js");
const v1RouterFS = require("./foodServices/v1/routes/index.js");
const v1RouterOrders = require("./orders/v1/routes/index.js");
const v1RouterUsers = require("./users/v1/routes/index.js");
const v1RouterCoupons = require("./coupons/v1/routes/index.js");
const v1RouterCategories = require("./categories/v1/routes/index.js");
const v1RouterLogin = require("./auth/index.js");
const v1RouterSchedule = require("./schedule/v1/routes/index.js");

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.SERVER_PORT || 3001;
const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/v1/employees", v1RouterEmployees);
app.use("/api/v1/foodServices", v1RouterFS);
app.use("/api/v1/orders", v1RouterOrders);
app.use("/api/v1/users", v1RouterUsers);
app.use("/api/v1/coupons", v1RouterCoupons);
app.use("/api/v1/categories", v1RouterCategories);
app.use("/api/v1/auth", v1RouterLogin);
app.use("/api/v1/schedule", v1RouterSchedule);

app.get("/getimage/:imageName", function (req, res) {
  const params = {
    Bucket: "devstorage",
    Key: req.params.imageName,
  };

  s3.getObject(params, function (err, data) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("cancel_order", (data) => {
    io.emit("cancel_order", data);
  });

  socket.on("complete_order", (data) => {
    io.emit("complete_order", data);
  });

  socket.on("delivery_order", (data) => {
    io.emit("delivery_order", data);
  });

  socket.on("new_order", (data) => {
    io.emit("new_order", data);
  });

  socket.on("pick_up_order", (data) => {
    io.emit("pick_up_order", data);
  });

  socket.on("cart_update", (data) => {
    console.log("cart_update", data);
    io.emit("cart_update", data);
  });

  socket.on("delivery_warning", (data) => {
    console.log("delivery_warning", data);
    io.emit("delivery_warning", data);
  });

  socket.on("update_menu", (data) => {
    io.emit("update_menu", data);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("user disconnected");
  });
});

process.once("SIGUSR2", function () {
  io.close();
  setTimeout(function () {
    process.kill(process.pid, "SIGUSR2");
  }, 100);
});
