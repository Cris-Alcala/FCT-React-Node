const DB = require("./db.json");
const DBUsers = require("../../users/database/db.json");
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

const getAllEmployees = (filterParams) => {
  try {
    let employees = DB.employees;
    if (filterParams.name) {
      employees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(filterParams.name.toLowerCase())
      );
    }
    if (filterParams.email) {
      employees = employees.filter(
        (employee) =>
          employee.email.toLowerCase() === filterParams.email.toLowerCase()
      );
    }
    return employees;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getEmployeeById = (id) => {
  try {
    const employee = DB.employees.find((employee) => employee.id == id);
    if (!employee) {
      throw { status: 404, message: "Employee not found" };
    }
    return employee;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addEmployee = async (employee) => {
  let existingEmployeeDNI;
  employee.dni !== ""
    ? (existingEmployeeDNI =
        DB.employees.findIndex(
          (employee_) =>
            employee_.dni.toLowerCase() == employee.dni.toLowerCase()
        ) > -1)
    : (existingEmployeeDNI = false);
  const existingEmployeeEmail =
    DB.employees.findIndex(
      (employee_) =>
        employee_.email.toLowerCase() == employee.email.toLowerCase()
    ) > -1;
  if (existingEmployeeDNI && existingEmployeeEmail) {
    throw {
      status: 400,
      message: `Employee with DNI ${employee.dni} or email ${employee.email} already exists`,
    };
  } else if (existingEmployeeDNI) {
    throw {
      status: 400,
      message: `Employee with DNI ${employee.dni} already exists`,
    };
  } else if (existingEmployeeEmail) {
    throw {
      status: 400,
      message: `User with email ${employee.email} already exists`,
    };
  } else {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(employee.password, saltRounds);
      const newEmployee = {
        ...employee,
        password: hashedPassword,
        created_at: new Date().toLocaleString("en-US", options),
        updated_at: new Date().toLocaleString("en-US", options),
      };
      DB.employees.push(newEmployee);
      saveToDatabase(DB, "./src/employees/database/db.json");
      return newEmployee;
    } catch (error) {
      throw { status: 500, message: "Internal Server Error" };
    }
  }
};

const updateEmployee = async (id, employee) => {
  let updatedEmployee;
  try {
    const existingEmployee = DB.employees.findIndex(
      (employee_) => employee_.id == id
    );
    if (existingEmployee < 0) {
      throw { status: 404, message: "Employee not found" };
    }
    if (employee.email) {
      const existingEmployeeEmail = DB.employees.find(
        (employee_) =>
          employee_.email.toLocaleLowerCase() ==
          employee.email.toLocaleLowerCase()
      );
      const existingUserEmail = DBUsers.users.find(
        (employee_) =>
          employee_.email.toLocaleLowerCase() ==
          employee.email.toLocaleLowerCase()
      );

      const existingEmployeeDNI = DB.employees.find(
        (employee_) => employee_.dni == employee.dni
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

      if (existingEmployeeDNI && existingEmployeeDNI.id != id) {
        throw {
          status: 400,
          message: `Employee with DNI ${employee.dni} already exists`,
        };
      }

      let { password, ...employeeData } = employee;

      if (password !== "") {
        const saltRounds = 10;
        password = await bcrypt.hash(password, saltRounds);
      } else {
        password = DB.employees[existingEmployee].password;
      }
      updatedEmployee = {
        ...DB.employees[existingEmployee],
        ...employeeData,
        password,
        updated_at: new Date().toLocaleString("en-US", options),
      };
    } else {
      updatedEmployee = {
        ...DB.employees[existingEmployee],
        ...employee,
        updated_at: new Date().toLocaleString("en-US", options),
      };
    }

    DB.employees[existingEmployee] = updatedEmployee;
    saveToDatabase(DB, "./src/employees/database/db.json");
    return updatedEmployee;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteEmployee = (id) => {
  try {
    const existingEmployee = DB.employees.findIndex(
      (employee_) => employee_.id == id
    );
    if (existingEmployee < 0) {
      throw { status: 404, message: "Employee not found" };
    }
    const deletedEmployee = DB.employees.splice(existingEmployee, 1);
    saveToDatabase(DB, "./src/employees/database/db.json");
    return deletedEmployee;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
