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

const getAllFS = (filterParams) => {
  try {
    let foodServices = DB.foodServices;
    if (filterParams.categorie) {
      foodServices = foodServices.filter(
        (fs_) => fs_.section === filterParams.categorie
      );
    }
    return foodServices;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getFSById = (id) => {
  try {
    const fs = DB.foodServices.find((fs_) => fs_.id == id);
    if (!fs) {
      throw { status: 404, message: "Food Service not found" };
    }
    return fs;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addFS = (foodService) => {
  const existingFS =
    DB.foodServices.findIndex((fs_) => fs_.name == foodService.name) > -1;
  if (existingFS) {
    throw {
      status: 400,
      message: `Food Service with name ${foodService.name} already exists`,
    };
  }
  try {
    const newFS = {
      ...foodService,
      ingredients: foodService.ingredients.split(", "),
      created_at: new Date().toLocaleString("en-US", options),
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.foodServices.push(newFS);
    saveToDatabase(DB, "./src/foodServices/database/db.json");
    return newFS;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateFS = (id, fs) => {
  console.log(fs);
  try {
    const existingFS = DB.foodServices.findIndex((fs_) => fs_.id == id);
    if (existingFS < 0) {
      throw { status: 404, message: "Food Service not found" };
    }
    const updatedFS = {
      ...DB.foodServices[existingFS],
      ...fs,
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.foodServices[existingFS] = updatedFS;
    saveToDatabase(DB, "./src/foodServices/database/db.json");
    return updatedFS;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteFS = (id) => {
  try {
    const existingFS = DB.foodServices.findIndex((fs_) => fs_.id == id);
    if (existingFS < 0) {
      throw { status: 404, message: "Food Service not found" };
    }
    const deletedFS = DB.foodServices.splice(existingFS, 1);
    saveToDatabase(DB, "./src/foodServices/database/db.json");
    return deletedFS;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllFS,
  getFSById,
  addFS,
  updateFS,
  deleteFS,
};
