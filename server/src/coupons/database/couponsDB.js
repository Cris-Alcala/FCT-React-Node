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

const getAllCoupons = (filterParams) => {
  try {
    let coupons =  DB.coupons;
    if (filterParams.name) {
      coupons = coupons.filter((coupon_) => coupon_.name.toLowerCase() === filterParams.name.toLowerCase());
    }
    return coupons;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const getCouponById = (id) => {
  try {
    const coupon = DB.coupons.find((coupon_) => coupon_.id == id);
    if (!coupon) {
      throw { status: 404, message: "Coupon not found" };
    }
    return coupon;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const addCoupon = (coupon) => {
  const existingCoupon =
    DB.coupons.findIndex((coupon_) => coupon_.name.toLowerCase() == coupon.name.toLowerCase()) > -1;
  if (existingCoupon) {
    throw {
      status: 400,
      message: `Coupon with name ${coupon.name} already exists`,
    };
  }
  try {
    const newCoupon = {
      ...coupon,
      created_at: new Date().toLocaleString("en-US", options),
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.coupons.push(newCoupon);
    saveToDatabase(DB, "./src/coupons/database/db.json");
    return newCoupon;
  } catch (error) {
    throw { status: 500, message: "Internal Server Error" };
  }
};

const updateCoupon = (id, coupon) => {
  try {
    const existingCoupon = DB.coupons.findIndex((coupon_) => coupon_.id == id);
    if (existingCoupon < 0) {
      throw { status: 404, message: "Coupon not found" };
    }
    const updatedCoupon = {
      ...DB.coupons[existingCoupon],
      ...coupon,
      updated_at: new Date().toLocaleString("en-US", options),
    };
    DB.coupons[existingCoupon] = updatedCoupon;
    saveToDatabase(DB, "./src/coupons/database/db.json");
    return updatedCoupon;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

const deleteCoupon = (id) => {
  try {
    const existingCoupon = DB.coupons.findIndex((coupon_) => coupon_.id == id);
    if (existingCoupon < 0) {
      throw { status: 404, message: "Coupon not found" };
    }
    const deletedCoupon = DB.coupons.splice(existingCoupon, 1);
    saveToDatabase(DB, "./src/coupons/database/db.json");
    return deletedCoupon;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

module.exports = {
  getAllCoupons,
  getCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
};
