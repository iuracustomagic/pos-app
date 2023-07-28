const fs = require("fs");
const { obfuscate } = require("javascript-obfuscator");
const { minify } = require("uglify-js");
const outputFolder = `${__dirname}/server`;
const startFolder = `${__dirname}/server`;
const cutFolder = startFolder.length;
const savePath = [];
let index = 0;

function checkEnd(currentDir, folder) {
  if (folder === startFolder) {
    index += 1;

    if (index >= currentDir) {
      fs.writeFileSync(
        `${__dirname}/output.json`,
        JSON.stringify(savePath, null, 2)
      );

      console.log("Uglified");
    }
  }
}

function searchFiles(folder) {
  const currentDir = fs.readdirSync(folder);
  const output = `${outputFolder}/${folder.slice(cutFolder)}`;

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  currentDir.forEach((cur) => {
    if (cur.slice(-3) === ".js") {
      const file = fs.readFileSync(`${folder}/${cur}`, "utf-8");

      savePath.push([`${folder}/${cur}`, file]);

      const outputCode = minify(
        obfuscate(file, {
          compact: false,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true,
          simplify: true,
          stringArrayShuffle: true,
          splitStrings: true,
          stringArrayThreshold: 1,
        }).getObfuscatedCode()
      ).code;
      fs.writeFileSync(`${output}/${cur.split(".")[0]}.js`, outputCode, {
        flag: "w",
      });
      checkEnd(currentDir.length, folder);
      return;
    }

    if (cur.split(".").length === 1) {
      searchFiles(`${folder}/${cur}`);
    }

    checkEnd(currentDir.length, folder);
  });
}

searchFiles(startFolder);
