"use strict";

process.on("uncaughtException", err => {});
'use strict';

const http = require("http");
const os = require("os");
const fs = require("fs");
const https = require("https");
const Config = require("./constants/constant");
const RouterConfig = require("./config/route.conf");
const _ = require("lodash");
const express = require("express");

const initApplication = (app, router) => {
  app = app || express();
  router = router || express.Router();

  if ("dev" === process.env.NODE_ENV) {
    let server;
    if (process.env.HTTPS) {
      //fix ssl localhost
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      server = https.createServer(
        {
          key: fs.readFileSync(__dirname + "/ssl/server.key"),
          cert: fs.readFileSync(__dirname + "/ssl/server.crt"),
          ca: fs.readFileSync(__dirname + "/ssl/ca.crt"),
          requestCert: true,
          rejectUnauthorized: false
        },
        app
      );
    } else {
      server = http.createServer(app);
    }

    server.listen(Config.PORT || 3000, Config.HOST, () => {
      console.log(
        `up and running @: ${os.hostname()} on port: ${Config.PORT || 3000}`
      );
      console.log(`enviroment: ${process.env.NODE_ENV || "Development"}`);
    });
  }

  // error handlers
  app.use((err, req, res, next) => {
    let statusCode =
      req.status || req.statusCode || err.code || err.statusCode || 500;

    const msg = !_.isEmpty(err.message)
      ? !_.isEmpty(err.message.sqlMessage)
        ? err.message.sqlMessage
        : err.message
      : "Something went wrong";

    return res.status(statusCode).json({
      data: null,
      message: msg
    });
  });
};

console.log("ENV", process.env.NODE_ENV)

if ("dev" == process.env.NODE_ENV) {
  initApplication();
} else {
  module.exports.init = function(app, router) {
    return initApplication(app, router);
  };
}
