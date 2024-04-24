const tokenVerify = require("../middleware/jwt.token");
const tokenMiddleware = async (req, res, next) => {
  let response = {};
  let token = req.headers.authorization ? req.headers.authorization : "";
  if (token === "") {
    response.status = 404;
    response.message = "Token is not found";
    return res.json(response);
  } else {
    // if get the token so verify the token
    if (token && token.split(" ")[0] === "Bearer") {
      token = token.split(" ")[1];
      let jwtData = await tokenVerify.JWTVerify(token);
      if (jwtData.status === false) {
        res.statusCode = 403;
        response.error = "TOKEN_INVALID_ERROR";
        response.errorMessage = "TOKEN_EXPIRED";
        return res.json(response);
      }

      res.locals.userData = jwtData.verify;
      next();
    } else {
      res.statusCode = 403;
      response.error = "PERMISSION_ERROR";
      response.errorMessage = "PERMISSION_ERROR_DESCRIPTION";
      return res.json(response);
    }
  }
};
module.exports = tokenMiddleware;
