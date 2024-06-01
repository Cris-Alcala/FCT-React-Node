const fs = require("fs");

const saveToDatabase = (DB, route) => {
  fs.writeFileSync(
    route,
    JSON.stringify(DB, null, 2),
    {
      encoding: "utf8",
    }
  );
};

module.exports = saveToDatabase;
