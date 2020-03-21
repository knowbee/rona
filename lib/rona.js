const fs = require("fs");
const re_normal = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\)(;|)$/gm; // something like const name = require("name");
const re_unique = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\).(\w+)(;|)$/gm; //something like const Bob = require("name").first
const re_special = /^(const|let|var)\s+\{\s*(\w+.+)\s*}\s+=\s+require\((.+?)\)(;|)$/gm; //something like const { name } = require("name")
// Go deeper no matter how project is structured and get all files with real path
const files = [];
basedir = process.argv[3];

// This function will return list of all files in all directories and subdirectories
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
  fs.writeFileSync(
    file,
    fs
      .readFileSync(file, "utf-8")
      .replace(re_normal, `import $2 from $3`)
      .replace(re_unique, `import { $4 as $2 } from $3`)
      .replace(re_special, `import { $2 } from $3`) + "\n"
  );
};
module.exports = {
  rona,
  transform
};
