"use strict";

const { init } = require("./dist/index");
const functions = require("firebase-functions");
const express = require("express");

const app = express()

init(app, express.Router());

exports.expressApp = functions.https.onRequest(app);
