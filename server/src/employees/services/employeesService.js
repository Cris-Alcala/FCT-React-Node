const { v4: uuidv4 } = require("uuid");
const employeesDB = require("../database/employeesDB");

const getAllEmployees = (filterParams) => {
  try {
    return employeesDB.getAllEmployees(filterParams);
  } catch (error) {
    throw error;
  }
};

const getEmployeeById = (id) => {
  try {
    return employeesDB.getEmployeeById(id);
  } catch (error) {
    throw error;
  }
};

const addEmployee = (employee) => {
  const newEmployee = {
    ...employee,
    id: employee.id || uuidv4(),
  };
  try {
    return employeesDB.addEmployee(newEmployee);
  } catch (error) {
    throw error;
  }
};

const updateEmployee = (id, employee) => {
  try {
    return employeesDB.updateEmployee(id, employee);
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = (id) => {
  try {
    return employeesDB.deleteEmployee(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
