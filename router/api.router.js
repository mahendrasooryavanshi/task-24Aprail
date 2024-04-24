const express = require("express");
const router = express.Router();
const { uploadFile } = require("../app");
const studentController = require("../controller/student.controller");
const { studentValidation } = require("../validation/student.validation");
const {
  signupValidation,
  loginValidation,
} = require("../validation/auth.validation");
const userController = require("../controller/auth.controller");
const tokenMiddleware = require("../middleware/token.middleware");
// register employee
router.post("/register", [signupValidation], userController.signup);
//login employee
router.post("/login", [loginValidation], userController.login);

router.post("/student/create", [studentValidation], studentController.create);
// router.get("/products", productController.products);
// router.put("/update/:productId", productController.update);
// router.delete("/delete", productController.delete);

// // csv file task
// // upload csv file
// router.post("/upload", uploadFile.single("fileName"), productController.upload);
// router.get("/createCSV", productController.createCSV);

module.exports = router;
