const employeesService = require("../services/employeesService");

const getAllEmployees = async (req, res) => {
  const { email } = req.query;
  const { name } = req.query;
  try {
    res.status(200).json(employeesService.getAllEmployees({ email, name }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }
    res.status(200).json(employeesService.getEmployeeById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    const employee = req.body;
    if (!employee) {
      return res.status(400).json({ error: "Employee data is required" });
    }
    res.status(201).json(await employeesService.addEmployee(employee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.body;
    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }
    if (!employee) {
      return res.status(400).json({ error: "Employee data is required" });
    }
    res.status(200).json(await employeesService.updateEmployee(id, employee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }
    res.status(200).json(employeesService.deleteEmployee(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}