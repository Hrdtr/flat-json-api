const fs = require("fs");

module.exports = {
  //read the user data from json file
  save: (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync("data.json", stringifyData);
  },
  //get the user data from json file
  get: () => {
    const jsonData = fs.readFileSync("data.json");
    return JSON.parse(jsonData);
  },
};
