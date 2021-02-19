const fs = require("fs");
const re_normal = /^(const|let|var)\s+(\w+)\s+=(\s*require\((.+?))\)(;|)$/gim; // const name = require("name");
const re_unique = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\).(\w+)(;|)$/gim; // const Bob = require("name").first
const re_special = /^(const|let|var)\s+\{\s*(\w+.+)\s*}\s+=\s+require\((.+?)\)(;|)$/gim; // const { name } = require("name")
const re_direct = /^require\((.+?)\)(;|)$/gim; // require("things")
const re_invoked = /^(const|let|var)\s*(\w+)\s*=(\s*require\((.+?))\)\(\)(;|)$/gim; // const name = require("person")()
const re_unique_invoked = /^(const|let|var)\s+(\w+)\s+=\s+require\((.+?)\).(\w+)\(\)(;|)$/gim; // const something = require("things").something()
const re_aliased = /^(const|let|var)\s*\{\s*((\w+)\s*\:\s*(\w+))\s*}\s*=\s*require\((.+?)\)(;|)$/gim; // const { name:anotherName } = require("name")
const re_general = /\s*(?:(?:const|let|var)\s+)?(\{?[\w,\s]+\}?)\s+=\s+require\((?:'|")([\w-\.\/]+)(?:'|")\)(;|,)?/gim;
const os = require("os");
const files = [];
basedir = process.argv[3];

let deeper = (dir, filelist) => {
  filelist = filelist || [];

  if (fs.statSync(dir).isFile()) {
    filelist.push(dir);
    return filelist;
  }
  f = fs.readdirSync(dir);
  dir = fs.realpathSync(dir);

  f.forEach((file) => {
    if (os.platform !== "win32") {
      file = dir + "/" + file;
    } else {
      file = dir + "\\" + file;
    }
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
    if (basedir) {
      const allfiles = resolve(deeper(basedir, files));
      resolve(allfiles);
    }
  } catch (error) {
    console.log("path is required: $rona --path <Path Name>");
    process.exit(1);
  }
});

const transform = (file) => {
  fs.writeFileSync(
    file,
    fs
      .readFileSync(file, "utf-8")
      .replace(re_invoked, `import $2 from $4`)
      .replace(re_unique_invoked, `import { $4 } from $3`)
      .replace(re_aliased, `import { $3 as $4 } from $5`)
      .replace(re_normal, `import $2 from $4`)
      .replace(re_direct, `import $1`)
      .replace(re_unique, `import { $4 as $2 } from $3`)
      .replace(re_special, `import { $2 } from $3`)
      .replace(re_general, `\n import $1 from $2`)
  );
};
module.exports = {
  rona,
  transform,
};
