const fs = require("fs");
const re_normal = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\)(;|)$/gm; // something like const name = require("name");
const re_unique = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\).(\w+)(;|)$/gm; //something like const Bob = require("name").first
const re_special = /^(const|let|var)\s+\{\s*(\w+.+)\s*}\s+=\s+require\((.+?)\)(;|)$/gm; //something like const { name } = require("name")
// Go deeper no matter how project is structured and get all files with real path
const files = [];
basedir = process.argv[3];
let deeper = (dir, filelist) => {
  filelist = filelist || [];

  // if a given path resolves to a file return that file and exit
  if (fs.statSync(dir).isFile()) {
    filelist.push(dir);
    return filelist;
  }
  f = fs.readdirSync(dir);
  dir = fs.realpathSync(dir);

  f.forEach(file => {
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
    console.log("path is required: $rona --path <Path Name>");
    process.exit(1);
  }
});

// go over each line in a file if a match is found append it to a backup file
const transform = file => {
  fs.readFileSync(file)
    .toString()
    .split("\n")
    .forEach(line => {
      fs.appendFileSync(
        file + "_bak",
        line
          .replace(re_normal, `import $2 from $3`)
          .replace(re_unique, `import { $4 as $2 } from $3`)
          .replace(re_special, `import { $2 } from $3`) + "\n"
      );
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

module.exports = {
  rona,
  transform
};
