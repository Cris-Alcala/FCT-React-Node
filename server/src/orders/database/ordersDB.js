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

const getAllOrders = (filterParams) => {
  try {
    let orders = DB.orders;
    if (filterParams.user) {
      orders = orders.filter(
        (order) =>
          order.user.toLowerCase() === filterParams.user.toLowerCase()
      );
    } else if (filterParams.state && filterParams.completed) {
      let completed = filterParams.completed.toLowerCase() === "true";
      orders = orders.filter(
        (order) =>
          order.state
            .toLowerCase()
            .includes(filterParams.state.toLowerCase()) &&
          order.completed == completed
      );
    }
    return orders;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getOrderById = (id) => {
  try {
    const order = DB.orders.find((order_) => order_.id == id);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }
    return order;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addOrder = (order) => {
  try {
    const newOrder = {
      ...order,
    };
    DB.orders.push(newOrder);
    saveToDatabase(DB, "./src/orders/database/db.json");
    return newOrder;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateOrder = (id, order) => {
  try {
    const existingOrder = DB.orders.findIndex((order_) => order_.id == id);
    if (existingOrder < 0) {
      throw { status: 404, message: "Order not found" };
    }
    const updatedOrder = {
      ...DB.orders[existingOrder],
      ...order,
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.orders[existingOrder] = updatedOrder;
    saveToDatabase(DB, "./src/orders/database/db.json");
    return updatedOrder;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteOrder = (id) => {
  try {
    const existingOrder = DB.orders.findIndex((order_) => order_.id == id);
    if (existingOrder < 0) {
      throw { status: 404, message: "Order not found" };
    }
    const deletedOrder = DB.orders.splice(existingOrder, 1);
    saveToDatabase(DB, "./src/orders/database/db.json");
    return deletedOrder;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
};
