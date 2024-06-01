const DB = require("./db.json");
const saveToDatabase = require("../../utils/saveToDatabase");

const getSchedule = () => {
  try {
    return DB.schedule;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateSchedule = (schedule) => {
  try {
    DB.schedule = {...schedule};
    saveToDatabase(DB, "./src/schedule/database/db.json");
    return schedule;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getSchedule,
  updateSchedule,
};
