#!/usr/bin/env node
const fs = require("fs");
const { helper } = require("./lib/help");
const { rona, transform } = require("./lib/rona");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const spinner = require("ora")();
clear();
console.log(
  chalk.magenta(figlet.textSync("rona", { horizontalLayout: "full" }))
);

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
              spinner.start();
              transform(file);
            });
            spinner.succeed("done");
          })
          .catch(error => {
            process.exit(1);
          });
      } else {
        console.log("");
        console.log("  $ rona --help");
        process.exit(0);
      }
    } catch (error) {
      console.log("invalid path");
    }
  }
});
