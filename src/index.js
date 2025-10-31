import express from "express";
import morgan from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from 'url'
import rfs from "rotating-file-stream"
import winstonElasticsearch from 'winston-elasticsearch'
import winston from 'winston'
import cors from "cors";
import cookieParser from 'cookie-parser'
import Routes from "./routers/index.js";
import KeyCloakService from './libs/keyCloakService.js';

export default class Server {
  keyCloak = new KeyCloakService();

  constructor(app, io) {
    this.config(app, io);
    new Routes(app);
  }

  config(app, io) {
    //Thoilc(*Note)-Cấu hình middleware tại đây dns: http://localhost:8081
    const corsOptions = {
      origin: "*",
      methods: "PUT, POST, GET, DELETE, OPTIONS, PATCH, HEAD",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 63072000,
    };
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // Thoilc-Bổ sung socket trên server
    let devices = [];
    let warehouse = [];
    let tallyInUse = [];
    io.on('connection', (socket) => {
      console.log('A client connected');
      socket.on('connected', function (dev) {
        socket.emit('connected', 'ketnoi');
      });
      socket.on('server_join_room', function (data) {
        warehouse = warehouse.filter(item => item.socketId !== data.socketId);
        let response = {
          status: false,
          payload: [],
          message: ''
        }
        if (Object.keys(data).length) {
          warehouse.push(data);
          socket.join(data.storageCode);
          response.status = true;
          response.payload = data;
          response.message = data.userName ? `Người dùng ${data.userName} đã đăng nhập kho ${data.storageCode}` : '';
        }
        socket.emit("client_join_room", response);
      })

      socket.on("server_login", function (data) {
        console.log("server_login", data, " - devices", devices);
        devices = devices.filter(item => item.socketId !== data.socketId);
        const checkIsset = data.userID ? devices.filter(item => item.userID === data.userID) : devices.filter(item => item.deviceCode === data.deviceCode);
        let response = {
          status: false,
          payload: [],
          message: ''
        };

        if (checkIsset.length) {
          if (checkIsset[0].socketId !== data.socketId) {
            data.userID ? response.status = false : '';
            response.message = data.userID ? "Tài khoản đang được sử dụng, vui lòng sử dụng tài khoản khác!" : "Thiết bị đang được sử dụng, vui lòng chọn thiết bị khác!";
          } else {
            response.status = true;
            devices = devices.map(item => {
              if (item.socketId === data.socketId) {
                return data;
              };
              return item;
            });
          }
        } else {
          devices.push(data);
          data.userID ? "" : socket.join(data.storageCode);
          response.status = true;
          response.payload = data;
          response.message = data.userID ? "Đăng nhập tài khoản thành công!" : "Đăng nhập thiết bị thành công!";
        };

        socket.emit("client_login", response);
      });

      socket.on('server_get_device_list', function (data) {
        io.emit('client_get_device_list', devices);
      });

      // ------------ gate monitoring --------------
      socket.on('gate_server_savein', function (data) {
        if (data) {
          const room = data.storageCode;
          if (data.tallyTruckItem.VESSEL_NAME) {
            io.emit('operating_gate', data.tallyTruckItem)
          }
          if (data.gateTruckItem) socket.to(room).emit('gate_client_savein', data.gateTruckItem);
          if (data.tallyTruckItem) socket.to(room).emit('tally_client_savein', data.tallyTruckItem);
          if (data.cheItem) socket.to(room).emit('che_client_savein', data.cheItem);
        };
      });
      // ------------ end-gate monitoring --------------

      // ------------- tally -----------------
      socket.on('tally_server_tallying', function (data) {
        const room = data.storageCode;
        let newSelected, oldSelected;
        if (data.selectedData) {
          newSelected = `${data.selectedData.ORDER_NO}_${data.selectedData.HOUSE_BILL ?? data.selectedData.BOOKING_FWD}`;
        };

        if (data.unSelectData) {
          oldSelected = `${data.unSelectData.ORDER_NO}_${data.unSelectData.HOUSE_BILL ?? data.unSelectData.BOOKING_FWD}`;
          tallyInUse = tallyInUse.filter(p => p !== oldSelected);
        };

        if (!tallyInUse.includes(newSelected)) {
          tallyInUse = [newSelected];
        };

        if (newSelected || oldSelected) socket.to(room).emit('tally_client_tallying', tallyInUse);
      });

      socket.on('tally_server_complete', function (data) {
        const room = data.storageCode;
        socket.to(room).emit('tally_client_complete', data);
      });

      socket.on('jobgate_server_complete', function (data) {
        const room = data.storageCode;
        io.emit('jobgate_client_complete', data);
      });

      socket.on('quantity_server_complete', function (data) {
        if (Object.keys(data).length) {
          const room = data.storageCode;
          socket.to(room).emit('quantity_client_complete', data);
        }
      });

      // ------------- che ---------------
      socket.on('che_server_change_position', function (data) {
        const room = data.storageCode;
        socket.to(room).emit('che_client_change_position', data);
      });

      socket.on('che_server_complete', function (data) {
        const room = data.storageCode;
        socket.to(room).emit('che_client_complete', data);
      });

      socket.on("server_logout", function (data) {
        console.log("server_logout", data);
        data.userName ? console.log(`Người dùng ${data.userName} đã đăng xuất!`) : console.log(`Thiết bị ${data[0]?.deviceName} đã đăng xuất!`);
        devices = devices.filter(p => p.socketId !== socket.id);
        io.emit('client_logout', data);
      });

      socket.on("sendDataClient", function (data) {
        io.emit("sendDataServer", { data });
      });

      socket.on('server_change_pallet_position', function (data) {
        socket.broadcast.emit('client_change_pallet_position', data);
      });

      socket.on('che_operating_server_complete', function (data) {
        if (Object.keys(data).length) {
          const room = data.storageCode;
          socket.to(room).emit('che_operating_client_complete', data.cheItem);

        }
      })

      socket.on("disconnect", () => {
        devices = devices.filter(p => p.socketId !== socket.id);
        console.log("Client disconnected" + socket.id);
      });
    });
    // =======================================================================
    if (process.env.LOG_LOCAL == 'TRUE') {
      if (process.env.LOG_LOCAL_FILE == 'TRUE') {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        var accessLogStream = rfs.createStream('access.log', {
          interval: '1d', // rotate daily
          path: path.join(__dirname, '../log')
        })
        app.use(morgan('combined', { stream: accessLogStream }))
      } else {
        app.use(morgan('combined'))
      }
    }
    if (process.env.LOG_ELK == 'TRUE') {
      const esTransportOpts = {
        level: 'info',
        indexPrefix: 'logging-api',
        indexSuffixPattern: 'YYYY-MM-DD',
        clientOpts: {
          node: process.env.ES_ADDON_URI,
          maxRetries: 5,
          requestTimeout: 10000,
          sniffOnStart: false,
          auth: {
            username: process.env.ES_ADDON_USER,
            password: process.env.ES_ADDON_PASSWORD
          }
        },
        source: process.env.LOG_SOURCE || 'api'
      };
      const esTransport = new winstonElasticsearch.ElasticsearchTransport(esTransportOpts);

      const logger = winston.createLogger({
        transports: [
          new winston.transports.Console({
            level: 'info',
            json: true
          }),
          esTransport //Add es transport
        ]
      });
    }

    const logoutUrl = '/logout';
    app.use(this.keyCloak.middleware(logoutUrl));
  }
}


