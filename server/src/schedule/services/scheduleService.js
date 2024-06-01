const { v4: uuidv4 } = require("uuid");
const scheduleDB = require("../database/scheduleDB");

const getSchedule = () => {
  try {
    return scheduleDB.getSchedule();
  } catch (error) {
    throw error;
  }
};

const updateSchedule = (schedule) => {
  try {
    return scheduleDB.updateSchedule(schedule);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSchedule,
  updateSchedule,
};
