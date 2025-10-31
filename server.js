import express from "express";
import Server from "./src/index.js";
import 'dotenv/config';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const httpServer = http.createServer(app); // Tạo HTTP server từ express app
// const io = new SocketServer(httpServer); // Tạo socket server từ HTTP server
//Thoilc-Đã cấu hình socket mới
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*", // hoặc cụ thể cho phép từ domain của trang web của bạn
    methods: ["GET", "POST"]
  }
})
new Server(app, io);
const PORT = normalizePort(process.env.PORT || '1111');

httpServer.listen(PORT, "localhost", function () {
  console.log(`Server is running on port ${PORT}.`);
})
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
httpServer.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onListening() {
  var addr = httpServer.address();
  console.log("addr", addr);
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}