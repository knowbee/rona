const fs = require("fs");
const re_normal = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\);?$/gm; // something like const name = require("name");
const re_unique = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\)(.\w+).+?$/gm; //something like const Bob = require("name").first
fs.readFileSync("./test.js")
  .toString()
  .split("\n")
  .forEach(function(line) {
    if (line.match(re_normal)) {
      const constant = line.split(" ")[1];
      const package = line.split("(")[1].replace(")", "");
      fs.appendFileSync(
        "./output.js",
        `import ${constant} from ${package}` + "\n"
      );
    } else {
      if (line.match(re_unique)) {
        const named_const = line.split('").')[1].replace(";", "");
        const package = line.split('").')[0].split('require("')[1];

        fs.appendFileSync(
          "./output.js",
          `import {${named_const}} from ${package}` + "\n"
        );
      } else {
        fs.appendFileSync("./output.js", line + "\n");
      }
    }
  });
