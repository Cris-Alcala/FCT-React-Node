const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const DBUsers = require("../users/database/db.json");
const DBEmployees = require("../employees/database/db.json");
const saveToDatabase = require("../utils/saveToDatabase");
const uuidV4 = require("uuid").v4;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = DBEmployees.employees.find(
    (employee) => employee.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    user = DBUsers.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const { password: pw, created_at, updated_at, ...userData } = user;

  res.json(userData);
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  let user = DBEmployees.employees.find(
    (employee) => employee.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    user = DBUsers.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: "",
      surname: "",
      address: "",
      phone: "",
      userName: "",
      id: uuidV4(),
      email: email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DBUsers.users.push(newUser);

    saveToDatabase(DBUsers, "./src/users/database/db.json");

    res.json(newUser);
  }
});

module.exports = router;
