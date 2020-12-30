const cli = require("commander");
const rona = new cli.Command();

module.exports = {
  helper: () => {
    rona
      .name("rona")
      .description(
        `
        **rona** is a tool that converts your project require syntax to ES6 import syntax as it should be
        `
      )
      .version("1.0.4")
      .option("--path, -p", "provide a path to run rona")
      .parse(process.argv);
    rona.on("--help", () => {
      console.log("How to use rona:");
      console.log("  $ rona --help");
      console.log("  $ rona --path ./src/");
      console.log("  $ rona --path index.js");
    });
  },
};
