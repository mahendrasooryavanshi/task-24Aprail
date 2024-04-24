const connection = require("../models");
const { sequelize, Sequelize } = connection;
const models = sequelize.models;
const { Op } = Sequelize;
const { User } = models;
const userService = {
  signup: async (data) => {
    try {
      let result = await User.create(data);
      return result.dataValues;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
  check: async (data) => {
    try {
      let result = await User.findOne(data);
      return result.dataValues;
    } catch (error) {
      console.log(error.message);
    }
  },
};
module.exports = userService;
