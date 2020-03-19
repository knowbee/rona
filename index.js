const fs = require("fs");
const re = /([A-Z]?[a-z]\w+)\s+([A-Z]?[a-z]\w+)\s+(=\s+require\(.+?)\)?.$/gm; // something like const name = require("name");

fs.readFileSync("./test.js")
  .toString()
  .split("\n")
  .forEach(function(line) {
    if (line.match(re)) {
      fs.appendFileSync(
        "./output.js",
        line
          .replace("const", "import")
          .replace("= require(", "from ")
          .replace(")", "") + "\n"
      );
    } else {
      fs.appendFileSync("./output.js", line + "\n");
    }
  });
