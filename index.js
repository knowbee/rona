#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const re_normal = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\);?$/gm; // something like const name = require("name");
const re_unique = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\)(.\w+).+?$/gm; //something like const Bob = require("name").first

// Go deeper no matter how project is structured and get all files with real path
const deeper = (dirname, cb) => {
  let files = [];
  fs.readdir(dirname, (err, list) => {
    dirname = fs.realpathSync(dirname);
    if (err) {
      return cb(err);
    }
    let listlength = list.length;
    list.forEach(file => {
      file = dirname + "\\" + file;
      fs.stat(file, (err, stat) => {
        if (stat && stat.isFile()) {
          files.push(file);
        }
        if (stat && stat.isDirectory()) {
          deeper(file, (err, parsed) => {
            files = files.concat(parsed);
            if (!--listlength) {
              cb(null, files);
            }
          });
        } else {
          if (!--listlength) {
            cb(null, files);
          }
        }
      });
    });
  });
};

const neza = file => {
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

  // if (file.includes("_bak")) {
  //   // const checker = file.split("_bak")[0] === file;
  //   fs.rename(file, file.split("_bak")[0], () => {
  //     console.log("done");
  //   });
  // }
};

// testing path
const basedir = path.join(__dirname + "/data/");
deeper(basedir, (err, res) => {
  if (err) {
    console.log(err);
  }
  res.forEach(file => {
    neza(file);
  });
});

setTimeout(() => {
  deeper(basedir, (err, res) => {
    if (err) {
      console.log(err);
    }
    res.forEach(file => {
      if (file.includes("_bak")) {
        fs.rename(file, file.split("_bak")[0], () => {
          // console.log("done");
        });
      }
    });
  });
}, 500);
