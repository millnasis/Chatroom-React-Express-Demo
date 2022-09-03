const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFile = promisify(fs.readFile);

module.exports = async (htmlName) => {
  try {
    let file = await readFile(path.join(__dirname,"../public/views", htmlName), "utf8");
    return file;
  } catch (error) {
    console.log(error);
  }
};
