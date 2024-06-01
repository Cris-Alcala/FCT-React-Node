const DB = require("./db.json");
const DBEmployees = require("../../employees/database/db.json");
const bcrypt = require("bcrypt");
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

const getAllUsers = (filterParams) => {
  try {
    let users = DB.users;
    if (filterParams.email) {
      users = users.filter(
        (user) => user.email.toLowerCase() === filterParams.email.toLowerCase()
      );
    }
    return users;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getUserById = (id) => {
  try {
    const user = DB.users.find((user_) => user_.id == id);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    return user;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addUser = (user) => {
  const existingUser =
    DB.users.findIndex((user_) => user_.email == user.email) > -1;
  const existingEmployeeEmail =
    DBEmployees.employees.findIndex(
      (employee_) => employee_.email.toLowerCase() == user.email.toLowerCase()
    ) > -1;
  if (existingUser || existingEmployeeEmail) {
    throw {
      status: 400,
      message: `User with email ${user.email} already exists`,
    };
  }
  try {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    const newUser = {
      ...user,
      password: hashedPassword,
      created_at: new Date().toLocaleString("en-US", options),
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.users.push(newUser);
    saveToDatabase(DB, "./src/users/database/db.json");
    return newUser;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateUser = async (id, user) => {
  try {
    const existingUser = DB.users.findIndex((user_) => user_.id == id);
    const existingEmployeeEmail = DBEmployees.employees.find(
      (employee_) =>
        employee_.email.toLocaleLowerCase() == user.email.toLocaleLowerCase()
    );
    const existingUserEmail = DB.users.find(
      (employee_) =>
        employee_.email.toLocaleLowerCase() == user.email.toLocaleLowerCase()
    );

    if (
      (existingEmployeeEmail && existingEmployeeEmail.id != id) ||
      (existingUserEmail && existingUserEmail.id != id)
    ) {
      throw {
        status: 400,
        message: `User with email ${employee.email} already exists`,
      };
    }

    if (existingUser < 0) {
      throw { status: 404, message: "User not found" };
    }
    let { password, ...userData } = user;

    if (password !== "") {
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
    } else {
      password = DB.users[existingUser].password;
    }

    const updatedUser = {
      ...DB.users[existingUser],
      ...userData,
      password,
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.users[existingUser] = updatedUser;
    saveToDatabase(DB, "./src/users/database/db.json");
    return updatedUser;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteUser = (id) => {
  try {
    const existingUser = DB.users.findIndex((user_) => user_.id == id);
    if (existingUser < 0) {
      throw { status: 404, message: "User not found" };
    }
    const deletedUser = DB.users.splice(existingUser, 1);
    saveToDatabase(DB, "./src/users/database/db.json");
    return deletedUser;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
