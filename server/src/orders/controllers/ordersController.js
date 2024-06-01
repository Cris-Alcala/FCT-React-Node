const ordersService = require("../services/ordersService");

const getAllOrders = async (req, res) => {
  const { state } = req.query;
  const { completed } = req.query;
  const { user } = req.query;
  try {
    res.status(200).json(ordersService.getAllOrders({ state, completed, user }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    res.status(200).json(ordersService.getOrderById(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const order = req.body;
    if (!order) {
      return res.status(400).json({ error: "Order data is required" });
    }
    res.status(201).json(await ordersService.addOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = req.body;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    if (!order) {
      return res.status(400).json({ error: "Order data is required" });
    }
    res.status(200).json(await ordersService.updateOrder(id, order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    res.status(200).json(ordersService.deleteOrder(id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};
