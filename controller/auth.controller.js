const userService = require("../services/user.service");
const userValidator = require("../validation/auth.validation");
const jwtAuth = require("../newTask/middleware/jwt.token");
const bcrypt = require("bcrypt");
const userController = {
  signup: async (req, res) => {
    let name = req.body.name ? req.body.name : "";
    let email = req.body.email ? req.body.email : "";
    let password = req.body.password ? req.body.password : "";
    let input = { name, email, password };
    let response = {};

    try {
      let EmailCheck = {
        where: {
          email: email,
          deletedAt: null,
        },
      };
      let checkEmail = await userService.check(EmailCheck);
      if (checkEmail) {
        response.message = "Email is already Exist";
        return res.status(409).json(response);
      }
      let hashPassword = await bcrypt.hash(password, 10);
      input = { ...input, password: hashPassword, isLogin: true };
      let result = await userService.signup(input);
      if (!result) {
        response.status = "ERROR";
        response.message = "something went wrong";
        return res.status(504).json(response);
      }
      let payload = {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        type: "Bearer",
        status: result.status,
      };
      let accessToken = await jwtAuth.accessToken(payload);
      let refreshToken = await jwtAuth.refreshToken({
        ...payload,
        type: "refreshToken",
      });
      if (!accessToken.status && !refreshToken.status) {
        response.error = "SOMETHING_WENT_WRONG_TYPE";
        response.errorMessage = "SOMETHING_WENT_WRONG";
        res.statusCode = 405;
        return res.json(response);
      }
      response.tokenType = payload.type;
      response.token = {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
      res.statusCode = 201;
      res.status(201).json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  login: async (req, res) => {
    let email = req.body.email ? req.body.email : "";
    let password = req.body.password ? req.body.password : "";
    let response = {};
    let input = { email, password };
    try {
      let Email = {
        where: {
          email: email,
          deleted_at: null,
        },
      };
      let user = await userService.check(Email);
      if (!user) {
        response.message = "Email is not found";
        return res.json(response);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        response.statusCode = 504;
        response.message = "Password is wrong";
        return res.status(504).json(response);
      }
      let payload = {
        email: user.email,
        role: "user",
        type: "Bearear",
        id: user.id,
      };

      let accessToken = await jwtAuth.accessToken(payload);
      let refreshToken = await jwtAuth.refreshToken({
        ...payload,
        type: "refreshToken",
      });
      if (!accessToken.status && !refreshToken.status) {
        response.error = "SOMETHING_WENT_WRONG_TYPE";
        response.errorMessage = "SOMETHING_WENT_WRONG";
        res.statusCode = 405;
        return res.json(response);
      }
      response.tokenType = payload.type;
      response.token = {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
      res.statusCode = 201;
      res.status(201).json(response);
    } catch (error) {
      console.log(error.message);
      response.statusCode = 504;
      response.message = error.message;
      return res.json(response);
    }
  },
};
module.exports = userController;
