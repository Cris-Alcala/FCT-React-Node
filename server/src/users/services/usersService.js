const { v4: uuidv4 } = require("uuid");
const usersDB = require("../database/usersDB");

const getAllUsers = (filterParams) => {
  try {
    return usersDB.getAllUsers(filterParams);
  } catch (error) {
    throw error;
  }
};

const getUserById = (id) => {
  try {
    return usersDB.getUserById(id);
  } catch (error) {
    throw error;
  }
};

const addUser = (user) => {
  const newUser = {
    ...user,
    id: user.id || uuidv4(),
  };
  try {
    return usersDB.addUser(newUser);
  } catch (error) {
    throw error;
  }
};

const updateUser = (id, user) => {
  try {
    return usersDB.updateUser(id, user);
  } catch (error) {
    throw error;
  }
};

const deleteUser = (id) => {
  try {
    return usersDB.deleteUser(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
