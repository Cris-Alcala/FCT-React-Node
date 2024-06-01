const FSService = require("../services/FSService");

const getAllFS = async (req, res) => {
  const { categorie } = req.query;
  try {
    res.status(200).json(FSService.getAllFS({ categorie }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFSById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Food Service ID is required" });
    }
    res.status(200).json(FSService.getFSById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFS = async (req, res) => {
  try {
    const fs = req.body;
    if (!fs) {
      return res.status(400).json({ error: "Food Service data is required" });
    }
    res.status(201).json(await FSService.addFS(fs));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFS = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = req.body;
    if (!id) {
      return res.status(400).json({ error: "Food Service ID is required" });
    }
    if (!fs) {
      return res.status(400).json({ error: "Food Service data is required" });
    }
    res.status(200).json(await FSService.updateFS(id, fs));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFS = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Food Service ID is required" });
    }
    res.status(200).json(FSService.deleteFS(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFS,
  getFSById,
  addFS,
  updateFS,
  deleteFS,
};
