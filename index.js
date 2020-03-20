#!/usr/bin/env node
const fs = require("fs");
const { helper } = require("./lib/help");
const { rona, transform } = require("./lib/rona");
helper();

if (process.argv.length < 3) {
  console.error(`Usage: rona --path <Path Name>`);
  process.exit(1);
}
// do the magic
process.argv.slice(2).forEach(cmd => {
  if (cmd === "--path" || cmd === "-p") {
    try {
      if (fs.existsSync(process.argv[3])) {
        rona
          .then(res => {
            res.forEach(file => {
              transform(file);
            });
          })
          .catch(error => {
            console.log("path is required");
          });
      } else {
        console.log("");
        console.log("  $ rona --help");
        process.exit();
      }
    } catch (error) {
      console.log("invalid path");
    }
  }
});
