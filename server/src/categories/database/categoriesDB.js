const DB = require("./db.json");
const saveToDatabase = require("../../utils/saveToDatabase");
const options = {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const getAllCategories = (filterParams) => {
  try {
    let categories = DB.categories;
    if (filterParams.name) {
      categories = categories.filter(
        (categorie_) =>
          categorie_.name.toLowerCase() === filterParams.name.toLowerCase()
      );
    }
    return categories;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getCategorieById = (id) => {
  try {
    const categorie = DB.categories.find((categorie_) => categorie_.id == id);
    if (!categorie) {
      throw { status: 404, message: "Categorie not found" };
    }
    return categorie;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addCategorie = (categorie) => {
  const existingCategorie =
    DB.categories.findIndex(
      (categorie_) =>
        categorie_.name.toLowerCase() == categorie.name.toLowerCase()
    ) > -1;
  if (existingCategorie) {
    throw {
      status: 400,
      message: `Categorie with name ${categorie.name} already exists`,
    };
  }
  try {
    const newCategorie = {
      ...categorie,
      created_at: new Date().toLocaleString("en-US", options),
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.categories.push(newCategorie);
    saveToDatabase(DB, "./src/categories/database/db.json");
    return newCategorie;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateCategorie = (id, categorie) => {
  try {
    const existingCategorie = DB.categories.findIndex(
      (categorie_) => categorie_.id == id
    );
    if (existingCategorie < 0) {
      throw { status: 404, message: "Categorie not found" };
    }
    const updatedCategorie = {
      ...DB.categories[existingCategorie],
      ...categorie,
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.categories[existingCategorie] = updatedCategorie;
    saveToDatabase(DB, "./src/categories/database/db.json");
    return updatedCategorie;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteCategorie = (id) => {
  try {
    const existingCategorie = DB.categories.findIndex(
      (categorie_) => categorie_.id == id
    );
    if (existingCategorie < 0) {
      throw { status: 404, message: "Categorie not found" };
    }
    const deletedCategorie = DB.categories.splice(existingCategorie, 1);
    saveToDatabase(DB, "./src/categories/database/db.json");
    return deletedCategorie;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllCategories,
  getCategorieById,
  addCategorie,
  updateCategorie,
  deleteCategorie,
};
