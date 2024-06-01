const { v4: uuidv4 } = require("uuid");
const ordersDB = require("../database/ordersDB");

const getAllOrders = (filterParams) => {
  try {
    return ordersDB.getAllOrders(filterParams);
  } catch (error) {
    throw error;
  }
};

const getOrderById = (id) => {
  try {
    return ordersDB.getOrderById(id);
  } catch (error) {
    throw error;
  }
};

const addOrder = (order) => {
  const newOrder = {
    ...order,
    id: uuidv4(),
  };
  try {
    return ordersDB.addOrder(newOrder);
  } catch (error) {
    throw error;
  }
};

const updateOrder = (id, order) => {
  try {
    return ordersDB.updateOrder(id, order);
  } catch (error) {
    throw error;
  }
};

const deleteOrder = (id) => {
  try {
    return ordersDB.deleteOrder(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};
