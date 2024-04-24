const connection = require("../models");
const { sequelize, Sequelize } = connection;
const Model = sequelize.models;
const { Product } = Model;
const productService = {
  create: async (data) => {
    try {
      return await Product.create(data);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  findOne: async (data) => {
    try {
      return await Product.findOne({
        where: data,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  procuctList: async (data) => {
    try {
      return await Product.findAll({
        where: data,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  update: async (data, where) => {
    try {
      return await Product.update(data, {
        where: where,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  upload: async (data) => {
    try {
      console.log(data);
      let result = await Product.bulkCreate(data);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
module.exports = productService;
