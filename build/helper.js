"use strict";

const isWindowsEnv = 'win32' === process.platform;
// execute a single shell command where "cmd" is a string
exports.exec = function(cmd, cb, context) {
  const child_process = require("child_process");
  const parts = cmd.split(/\s+/g);
  const p = child_process.spawn(`${parts[0]}${isWindowsEnv ? '.cmd' : ''}`, parts.slice(1), { stdio: "inherit", cwd: context || './' });

  p.on("exit", function(code) {
    let err = null;
    if (code) {
      err = new Error(
        'command "' + cmd + '" exited with wrong status code "' + code + '"'
      );
      err.code = code;
      err.cmd = cmd;
    }
    if (cb) cb(err);
  });
};
