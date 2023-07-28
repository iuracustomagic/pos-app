const fs = require("fs");
const file = require("./output.json");

file.forEach((cur) => {
  const [path, input] = cur;

  fs.writeFileSync(path, input);
});

console.log("The END");
