"use strict";

const path = require("path");
const shell = require("./build/helper");
const fs = require("fs-extra");

const removeFolder = dir => {
  return new Promise((resolve, reject) => {
    console.log("");
    console.log("Cleaning up...");
    fs.remove(dir, err => {
      if (err) {
        reject(err);
        console.error(err);
        return;
      }
      resolve(true);
    });
  });
};

const copyDistFolderToFunctions = () => {
  return new Promise((resolve, reject) => {
    const sourceDir = path.join(__dirname, "dist");
    const destDir = path.join(__dirname, "functions", "dist");

    fs.copy(sourceDir, destDir, err => {
      if (err) {
        console.log("An error occured while copying the folder.");
        reject(err);
        return console.error(err);
      }
      console.log("");
      console.log("Copy completed!");
      resolve(true);
    });
  });
};

const copyAPIApplicationToUIBuild = () => {
  return new Promise((resolve, reject) => {
    const sourceDir = path.join(__dirname, "server");
    const destDir = path.join(__dirname, "functions", "dist");

    fs.copy(sourceDir, destDir, /node_modules$/, err => {
      if (err) {
        console.log("An error occured while copying the folder.");
        reject(err);
        return console.error(err);
      }
      console.log("");
      console.log("Copy completed!");
      resolve(true);
    });
  });
};

const buildUIApplication = () => {
  // execute multiple commands in series
  return new Promise((resolve, reject) => {
    shell.exec("npm run build:ssr", function(err) {
      if (err) {
        console.error(err);
        reject(err);
        return false;
      }
      console.log("");
      console.log("Finished bundling ui application.");
      resolve(true);
    });
  });
};

const deploy = () => {
  return new Promise((resolve, reject) => {
    shell.exec("firebase deploy", function(err) {
      if (err) {
        console.error(err);
        reject(err);
        return false;
      }
      console.log("");
      console.log("Finished bundling ui application.");
      resolve(true);
    });
  });
};

const prepareDeploy = () => {
  removeFolder(path.join(__dirname, "functions", "dist"))
    .then(__ => removeFolder(path.join(__dirname, "dist")))
    .then(__ => buildUIApplication())
    .then(__ => copyDistFolderToFunctions())
    .then(__ => {
      console.log("");
      console.log("Starting with api application");
      copyAPIApplicationToUIBuild();
    });
};

prepareDeploy();
