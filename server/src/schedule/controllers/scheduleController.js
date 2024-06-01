const scheduleService = require("../services/scheduleService");

const getSchedule = async (req, res) => {
  try {
    res.status(200).json(scheduleService.getSchedule());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = req.body;
    if (!schedule) {
      return res.status(400).json({ error: "Schedule data is required" });
    }
    res.status(200).json(await scheduleService.updateSchedule(schedule));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSchedule,
  updateSchedule,
};
