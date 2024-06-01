const { v4: uuidv4 } = require("uuid");
const FSDB = require("../database/FSDB");

const getAllFS = (filterParams) => {
  try {
    return FSDB.getAllFS(filterParams);
  } catch (error) {
    throw error;
  }
};

const getFSById = (id) => {
  try {
    return FSDB.getFSById(id);
  } catch (error) {
    throw error;
  }
};

const addFS = (fs) => {
  const newFS = {
    ...fs,
    id: uuidv4(),
  };
  try {
    return FSDB.addFS(newFS);
  } catch (error) {
    throw error;
  }
};

const updateFS = (id, fs) => {
  try {
    return FSDB.updateFS(id, fs);
  } catch (error) {
    throw error;
  }
};

const deleteFS = (id) => {
  try {
    return FSDB.deleteFS(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllFS,
  getFSById,
  addFS,
  updateFS,
  deleteFS,
};
