const { v4: uuidv4 } = require("uuid");
const categoriesDB = require("../database/categoriesDB");

const getAllCategories = (filterParams) => {
  try {
    return categoriesDB.getAllCategories(filterParams);
  } catch (error) {
    throw error;
  }
};

const getCategorieById = (id) => {
  try {
    return categoriesDB.getCategorieById(id);
  } catch (error) {
    throw error;
  }
};

const addCategorie = (categorie) => {
  const newCategorie = {
    ...categorie,
    id: uuidv4(),
  };
  try {
    return categoriesDB.addCategorie(newCategorie);
  } catch (error) {
    throw error;
  }
};

const updateCategorie = (id, categorie) => {
  try {
    return categoriesDB.updateCategorie(id, categorie);
  } catch (error) {
    throw error;
  }
};

const deleteCategorie = (id) => {
  try {
    return categoriesDB.deleteCategorie(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategories,
  getCategorieById,
  addCategorie,
  updateCategorie,
  deleteCategorie,
};
