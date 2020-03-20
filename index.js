#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { helper } = require("./lib/help");
const re_normal = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\);?$/gm; // something like const name = require("name");
const re_unique = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\)(.\w+).+?$/gm; //something like const Bob = require("name").first

helper();

if (process.argv.length < 3) {
  console.error(`Usage: rona --path <Path Name>`);
  process.exit(1);
}

// Go deeper no matter how project is structured and get all files with real path
const files = [];
basedir = process.argv[3];
let deeper = function(dir, filelist) {
  filelist = filelist || [];

  // if a given path resolves to a file return that file and exit
  if (fs.statSync(dir).isFile()) {
    filelist.push(dir);
    return filelist;
  }
  f = fs.readdirSync(dir);
  dir = fs.realpathSync(dir);

  f.forEach(function(file) {
    file = dir + "\\" + file;
    if (fs.statSync(file).isDirectory()) {
      filelist = deeper(file, filelist);
    } else {
      if (
        (file.includes(".js") && !file.includes(".json")) ||
        file.includes("_bak")
      )
        filelist.push(file);
    }
  });
  return filelist;
};

let rona = new Promise((resolve, reject) => {
  try {
    const allfiles = resolve(deeper(basedir, files));
    return allfiles;
  } catch (error) {
    reject(error);
  }
});

// do the magic
process.argv.slice(2).forEach(function(cmd) {
  if (cmd === "--path" || cmd === "-p") {
    try {
      if (fs.existsSync(process.argv[3])) {
        try {
          rona
            .then(res => {
              res.forEach(file => {
                transform(file);
              });
            })
            .catch(error => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
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

const transform = file => {
  fs.readFileSync(file)
    .toString()
    .split("\n")
    .forEach(function(line) {
      if (line.match(re_normal)) {
        const constant = line.split(" ")[1];
        const package = line.split("(")[1].replace(")", "");
        fs.appendFileSync(
          file + "_bak",
          `import ${constant} from ${package}` + "\n"
        );
      } else {
        if (line.match(re_unique)) {
          const named_const = line.split('").')[1].replace(";", "");
          const package = line.split(").")[0].split("require(")[1];
          fs.appendFileSync(
            file + "_bak",
            `import {${named_const}} from ${package}` + "\n"
          );
        } else {
          fs.appendFileSync(file + "_bak", line + "\n");
        }
      }
    });
};

// take a cup of coffee wait for 500 millseconds
const bakfiles = [];
setTimeout(() => {
  const files = deeper(basedir, bakfiles);

  // if the path specified only resolves to one file
  if (files.length == 1 && fs.existsSync(basedir + "_bak")) {
    const newfile = basedir + "_bak";
    files.forEach(file => {
      fs.rename(newfile, newfile.split("_bak")[0], err => {});
    });
  } else {
    // if the path given resolves to a folder with with 1 or more than 1 files
    files.forEach(file => {
      if (file.includes("_bak")) {
        fs.rename(file, file.split("_bak")[0], err => {});
      }
    });
  }
}, 500);
