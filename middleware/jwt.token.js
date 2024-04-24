const jwt = require("jsonwebtoken");
const jwtAuth = {
  accessToken: async (payload) => {
    try {
      const token = await jwt.sign(payload, "Welcome@123", {
        expiresIn: "1h",
      });
      return {
        token: token,
        expireTime: "1h",
        status: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        expiresIn: tokenExpireTime,
        token: "",
        status: false,
      };
    }
  },
  refreshToken: async (payload) => {
    try {
      const token = await jwt.sign(payload, "Welcome@123", {
        expiresIn: "1h",
      });
      return {
        token: token,
        expireTime: "12h",
        status: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        token: "",
        status: false,
      };
    }
  },
  JWTVerify: async (token) => {
    try {
      return jwt.verify(token, "Welcome@123", async (error, decoded) => {
        if (error) {
          return {
            status: false,
            verify: {},
            error: error,
          };
        } else {
          return {
            status: true,
            verify: decoded,
          };
        }
      });
    } catch (error) {
      console.log(error);
      return {
        status: false,
        verify: {},
      };
    }
  },
};
module.exports = jwtAuth;
