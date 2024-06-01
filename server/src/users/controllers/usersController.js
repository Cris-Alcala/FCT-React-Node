const usersService = require("../services/usersService");

const getAllUsers = async (req, res) => {
  const { email } = req.query;
  try {
    res.status(200).json(usersService.getAllUsers({ email }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    res.status(200).json(usersService.getUserById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }
    res.status(201).json(await usersService.addUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }
    res.status(200).json(await usersService.updateUser(id, user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    res.status(200).json(usersService.deleteUser(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
